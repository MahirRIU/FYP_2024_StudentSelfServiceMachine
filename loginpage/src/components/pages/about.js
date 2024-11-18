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

  // Fetch student data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
  
    if (userData?.user) {
      const { user } = userData;
  
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
      <button
        className={`apply-button ${allVerified ? '' : 'disabled'}`}
        onClick={() => allVerified && alert('Applying for Transcript!')}
        disabled={!allVerified}
      >
        Apply for Transcript
      </button>
    </div>
  );
};

export default About;
