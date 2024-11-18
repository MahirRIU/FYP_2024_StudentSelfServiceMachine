import React, { useState, useEffect } from 'react';
import './analytics.css';

const generateTransactionId = () => {
  // Generate a random transaction ID between 1000-9999
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const addTransaction = async (transactionData) => {
  try {
    const response = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error('Failed to add transaction log');
    }

    const data = await response.json();
    console.log('Transaction added:', data);
  } catch (error) {
    console.error('Error adding transaction log:', error);
  }
};

const Analytics = () => {
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isApplied, setIsApplied] = useState(false);
  const [registrationNo, setRegistrationNo] = useState('');

  // Retrieve student data from localStorage
  const studentData = JSON.parse(localStorage.getItem('userData')).user;

  useEffect(() => {
    // Set initial values only once
    setIsApplied(studentData.clearanceApplied || false);
    setSubmissionMessage(
      studentData.clearanceApplied ? 'You have already applied for the clearance form.' : ''
    );
    setTimerActive(studentData.timerActive || false);
    setTimeRemaining(studentData.timeRemaining || 0);
    setRegistrationNo(studentData.registrationNo || ''); // Set initial registration number
  }, []); // Empty dependency array to run only once on mount

  const handleApplyForClearance = async () => {
    if (!registrationNo) {
      setSubmissionMessage('Please enter your registration number to proceed.');
      return;
    }

    if (studentData.balance >= 5000) {
      try {
        const response = await fetch('http://localhost:5000/api/users/students/apply-clearance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: studentData._id,
            registrationNo,
            amount: 5000,
          }),
        });

        if (response.ok) {
          const updatedData = await response.json();
          setSubmissionMessage('Your clearance form has been submitted successfully.');
          setIsApplied(true);
          setTimerActive(true);
          setTimeRemaining(2 * 24 * 60 * 60); // 2 days in seconds

          // Update local storage with new balance and clearance status
          studentData.balance = updatedData.newBalance;
          studentData.clearanceApplied = true;
          localStorage.setItem('userData', JSON.stringify({ user: studentData }));

          // Generate and log the transaction
          const transactionData = {
            trans_id: generateTransactionId(),
            date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
            time: new Date().toLocaleTimeString(), // Current time in HH:MM:SS
            stud_id: studentData._id,
            amount: 5000,
          };

          await addTransaction(transactionData); // Log the transaction
        } else {
          const errorData = await response.json();
          setSubmissionMessage(errorData.message || 'Failed to apply for clearance.');
        }
      } catch (error) {
        console.error('Error applying for clearance:', error);
        setSubmissionMessage('An error occurred. Please try again later.');
      }
    } else {
      setSubmissionMessage('Insufficient balance to apply for clearance. Please add funds.');
    }
  };

  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
    }

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="analytics-container">
      <h1>Clearance Form</h1>
      <div className="student-info">
        <p>SAP ID: {studentData.sap_id}</p>
        <p>Student Name: {studentData.name}</p>
        <p>Balance: ₹{studentData.balance}</p>
        <div className="form-group">
          <label>Registration No:</label>
          <input
            type="text"
            value={registrationNo}
            onChange={(e) => setRegistrationNo(e.target.value)}
            required
            placeholder="Enter Registration Number"
            disabled={isApplied} // Disable if already applied
          />
        </div>
      </div>
      {!isApplied ? (
        <button className="apply-button" onClick={handleApplyForClearance}>
          Apply for Clearance Form (₹5000)
        </button>
      ) : (
        <div className="submission-message">
          <p>{submissionMessage}</p>
          {timerActive && <p>Time remaining: {formatTime(timeRemaining)}</p>}
        </div>
      )}
    </div>
  );
};

export default Analytics;
