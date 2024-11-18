import React, { useState } from 'react';
import styles from './login.module.css'; // Import CSS module for styling
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import { Link, useNavigate } from "react-router-dom";

const Login1 = ({ setUser }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = async () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);

    try {
      // Send login request to the backend
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.email,
          password: values.pass,
        }),
      });
    
      const data = await response.json();
      console.log("Received data from server:", data);
    
      if (response.ok) {
        console.log("Login successful");
        
        // Save the data object to localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        
        // Update user state in App
        if (data.user) {
          setUser(data.user);
        }

        // Redirect based on the role
        if (data.user.role === 'student') {
          navigate("/userdashboard"); // Redirect to the student dashboard
        } else if (data.user.role === 'deptMember') {
          navigate("/deptmemberdashboard"); // Redirect to the department member dashboard
        } else {
          console.error("Unknown role:", data.user.role);
          setErrorMsg("Unknown role. Please contact support.");
        }
      } else {
        setErrorMsg(data.message || "Invalid email or password");
        console.error("Login failed:", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setSubmitButtonDisabled(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>Login</div>
        <div className={styles.underline}></div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <b className={styles.error}>{errorMsg}</b>
          <img src={email_icon} alt="email-icon" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
          />
        </div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <img src={password_icon} alt="password-icon" />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
          />
        </div>
      </div>


      <div className={styles['submit-container']}>
        <button
          className={styles.submit}
          onClick={handleSubmission}
          disabled={submitButtonDisabled}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login1;
