import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Form } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DeptDashboard = () => {
  const [students, setStudents] = useState([]);
  const [deptName, setDeptName] = useState('');
  const [faculty, setFaculty] = useState(''); // Store the faculty of the department member
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({}); // Store comments for each student
  const navigate = useNavigate(); // React Router's navigation function

  // Fetch dept member data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.user) {
      const { user } = userData;
      setDeptName(user.dept_name);
      if (user.dept_name === 'Coordination') {
        setFaculty(user.faculty); // Extract faculty for Coordination department member
      }
    }

    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/clearance-students', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students.');
        }

        const data = await response.json();
        setStudents(data);

        // Initialize comments state
        const initialComments = {};
        data.forEach((student) => {
          initialComments[student._id] = {
            library_dept_comment: student.library_dept_comment || '',
            exam_dept_comment: student.exam_dept_comment || '',
            fee_dept_comment: student.fee_dept_comment || '',
            ssd_dept_comment: student.ssd_dept_comment || '',
            coordination_dept_comment: student.coordination_dept_comment || '',
          };
        });
        setComments(initialComments);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleUpdateStatus = async (studentId, statusField, commentField) => {
    if (!commentField) {
      console.error(`Comment field is missing for statusField: ${statusField}`);
      alert('Comment field is required.');
      return;
    }

    const newStatus = !students.find((student) => student._id === studentId)[statusField];
    const comment = comments[studentId]?.[commentField] || '';

    try {
      const response = await fetch(`http://localhost:5000/api/users/update-student-status/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusField,
          commentField,
          newStatus,
          comment,
        }),
      });

      if (response.ok) {
        const updatedStudents = students.map((student) =>
          student._id === studentId
            ? { ...student, [statusField]: newStatus, [commentField]: comment }
            : student
        );
        setStudents(updatedStudents);
        alert('Status and comment updated successfully!');
      } else {
        alert('Failed to update status or comment.');
      }
    } catch (error) {
      console.error('Error updating status or comment:', error);
    }
  };

  const handleCommentChange = (studentId, commentField, value) => {
    setComments((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [commentField]: value },
    }));
  };

  const handleLogout = () => {
    // Clear user data and navigate to the login page
    localStorage.removeItem('userData');
    navigate('/');
  };

  const renderTableHeadings = () => {
    switch (deptName) {
      case 'Library':
        return (
          <>
            <th>SAP ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Books Borrowed</th>
            <th>Books Returned</th>
            <th>Action</th>
            <th>Comment</th>
          </>
        );
      case 'Exam':
        return (
          <>
            <th>SAP ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Earned Credits</th>
            <th>Required Credits</th>
            <th>CGPA</th>
            <th>Action</th>
            <th>Comment</th>
          </>
        );
      case 'Fee':
        return (
          <>
            <th>SAP ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Remaining Fee</th>
            <th>Total Fee</th>
            <th>Action</th>
            <th>Comment</th>
          </>
        );
      case 'SSD':
        return (
          <>
            <th>SAP ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
            <th>Comment</th>
          </>
        );
      case 'Coordination':
        return (
          <>
            <th>SAP ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Library Status</th>
            <th>Exam Status</th>
            <th>Fee Status</th>
            <th>SSD Status</th>
            <th>Action</th>
            <th>Comment</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return students
      .filter((student) => {
        // For Coordination department, filter by faculty
        if (student.transcript_applied) {
            return false;
          }
          
        if (deptName === 'Coordination') {
          return student.clearanceApplied && student.faculty === faculty;
        }
        // For other departments, show all students who have applied for clearance
        return student.clearanceApplied;
      })
      .map((student) => {
        const commonFields = (
          <>
            <td>{student.sap_id}</td>
            <td>{student.name}</td>
            <td>{student.email}</td>
          </>
        );
  
        const renderStatusButton = (statusField, commentField) => (
          <>
            <td>
              <Button
                variant={student[statusField] ? 'success' : 'danger'}
                onClick={() => handleUpdateStatus(student._id, statusField, commentField)}
              >
                {student[statusField] ? (
                  <>
                    <FaCheckCircle /> Verified
                  </>
                ) : (
                  <>
                    <FaTimesCircle /> Not Verified
                  </>
                )}
              </Button>
            </td>
            <td>
              <Form.Control
                type="text"
                placeholder="Add comment"
                value={comments[student._id]?.[commentField] || ''}
                onChange={(e) =>
                  handleCommentChange(student._id, commentField, e.target.value)
                }
              />
            </td>
          </>
        );
  
        switch (deptName) {
          case 'Library':
            return (
              <tr key={student._id}>
                {commonFields}
                <td>{student.books_borrowed}</td>
                <td>{student.books_returned}</td>
                {renderStatusButton('library_dept_status', 'library_dept_comment')}
              </tr>
            );
          case 'Exam':
            return (
              <tr key={student._id}>
                {commonFields}
                <td>{student.earned_credits}</td>
                <td>{student.required_credits}</td>
                <td>{student.cgpa}</td>
                {renderStatusButton('exam_dept_status', 'exam_dept_comment')}
              </tr>
            );
          case 'Fee':
            return (
              <tr key={student._id}>
                {commonFields}
                <td>{student.remaining_fee}</td>
                <td>{student.total_fee}</td>
                {renderStatusButton('fee_dept_status', 'fee_dept_comment')}
              </tr>
            );
          case 'SSD':
            return (
              <tr key={student._id}>
                {commonFields}
                {renderStatusButton('ssd_dept_status', 'ssd_dept_comment')}
              </tr>
            );
          case 'Coordination':
            return (
              <tr key={student._id}>
                {commonFields}
                <td>{student.library_dept_status ? 'Approved' : 'Pending'}</td>
                <td>{student.exam_dept_status ? 'Approved' : 'Pending'}</td>
                <td>{student.fee_dept_status ? 'Approved' : 'Pending'}</td>
                <td>{student.ssd_dept_status ? 'Approved' : 'Pending'}</td>
                {renderStatusButton('coordination_dept_status', 'coordination_dept_comment')}
              </tr>
            );
          default:
            return null;
        }
      });
  };
  

  return (
    <div className="dept-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Department Dashboard</h1>
        <Button 
  variant="danger" 
  style={{ maxWidth: '100px' }} 
  className="ma button-limited-width" 
  onClick={handleLogout}
>
  Logout
</Button>
      </div>
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>{renderTableHeadings()}</tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </Table>
      )}
    </div>
  );
};

export default DeptDashboard;
