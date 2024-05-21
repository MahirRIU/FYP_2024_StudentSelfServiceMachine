import React, { useState } from 'react';
import styles from './login.module.css'; // Import CSS module for styling
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const Login1 = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setsubmitButtonDisabled] = useState(false);

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    setErrorMsg("");

    setsubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(res => {
        console.log("Login successful:", res);
        setsubmitButtonDisabled(false);
        navigate("/mainscreen"); // Redirect user to home page after successful login
      })
      .catch(error => {
        setsubmitButtonDisabled(false);
        setErrorMsg(error.message); // Display Firebase error message to user
        console.error("Login failed:", error);
      });
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
          <img src={email_icon} alt="" />
          <input type="email" id="email" name="email" placeholder='Email' onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))}/>
        </div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <img src={password_icon} alt="" />
          <input type="password" id="password" name="password" placeholder='Password'onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))} />
        </div>
      </div>

      <div className={styles['forgot-password']}>
        <Link to="/signup">Don't have an account? signup</Link>
      </div>

      <div className={styles['submit-container']}>
        <div className={styles.submit} onClick={handleSubmission} disabled={submitButtonDisabled}>
          Login
        </div>
      </div>
    </div>
  );
};

export default Login1;
