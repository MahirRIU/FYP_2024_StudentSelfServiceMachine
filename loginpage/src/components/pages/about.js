import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './about.css'; // Ensure this file contains your styling

const About = () => {
  const [departments, setDepartments] = useState({
    CoordinationDepartment: { verified: false, comment: 'No comments.' },
    ExamDepartment: { verified: false, comment: 'No comments.' },
    LibraryDepartment: { verified: false, comment: 'No comments.' },
    StudentServicesDepartment: { verified: false, comment: 'No comments.' },
    FeeDepartment: { verified: false, comment: 'No comments.' }, // Added FeeDepartment
  });
  const [isTranscriptApplied, setIsTranscriptApplied] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Fetch student data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.user) {
      const { user } = userData;

      setIsTranscriptApplied(user.transcript_applied || false); // Check if transcript is already applied

      setDepartments({
        CoordinationDepartment: {
          verified: user.coordination_dept_status, // Assuming it's a boolean
          comment: user.coordination_dept_comment,
        },
        ExamDepartment: {
          verified: user.exam_dept_status, // Assuming it's a boolean
          comment: user.exam_dept_comment,
        },
        LibraryDepartment: {
          verified: user.library_dept_status, // Assuming it's a boolean
          comment: user.library_dept_comment,
        },
        StudentServicesDepartment: {
          verified: user.ssd_dept_status, // Assuming it's a boolean
          comment: user.ssd_dept_comment,
        },
        FeeDepartment: {
          verified: user.fee_dept_status, // Assuming it's a boolean
          comment: user.fee_dept_comment,
        },
      });
    }
  }, []);

  const allVerified = Object.values(departments).every((dept) => dept.verified);

  const handleApplyForTranscript = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userId = userData.user._id;
  
      const response = await fetch(`http://localhost:5000/api/users/${userId}/apply-transcript`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Parse PDF data from the response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.pdf'; // Set the file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  
        setIsTranscriptApplied(true);
        setSubmissionMessage('Transcript application submitted successfully.');
  
        // Update localStorage
        userData.user.transcript_applied = true;
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        const errorData = await response.json();
        setSubmissionMessage(errorData.message || 'Failed to apply for transcript.');
      }
    } catch (error) {
      console.error('Error applying for transcript:', error);
      setSubmissionMessage('An error occurred. Please try again later.');
    }
  };
  

  return (
    <div className="about-container">
      <h1 className="text-center mb-4">Clearance Status</h1>
      <div className="bubbles-container">
        {Object.entries(departments).map(([deptName, { verified, comment }], index) => (
          <React.Fragment key={deptName}>
            <div
              className={`bubble ${verified ? 'verified' : 'not-verified'}`}
              tabIndex="0"
              aria-label={`${deptName} status`}
            >
              <h2>{deptName.split(/(?=[A-Z])/).join(' ')}</h2>
              <p>{verified ? 'Verified' : 'Not Verified'}</p>
              <p className="comment">{comment}</p>
            </div>
            {index < Object.keys(departments).length - 1 && <div className="connector-line"></div>}
          </React.Fragment>
        ))}
      </div>
      {isTranscriptApplied ? (
        <p className="text-center text-success">Transcript has already been applied.</p>
      ) : (
        <button
          className={`apply-button ${allVerified ? '' : 'disabled'}`}
          onClick={handleApplyForTranscript}
          disabled={!allVerified}
        >
          Apply for Transcript
        </button>
      )}
      {submissionMessage && <p className="text-center mt-3">{submissionMessage}</p>}
    </div>
  );
};

export default About;
