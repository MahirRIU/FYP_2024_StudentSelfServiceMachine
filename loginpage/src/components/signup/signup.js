import React, { useState } from 'react';
import styles from './signup.module.css'; // Import CSS module for styling
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import person_icon from "../assets/person.png";
import { Link,useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';

const Signup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled,setsubmitButtonDisabled] = useState(false);
  
  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    setErrorMsg("");

    setsubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async(res) => {
        console.log("Signup successful:", res);
        setsubmitButtonDisabled(false);
        const user = res.user;
        await updateProfile(user,{
          displayName: values.name,
      });
      navigate("/")
        console.log(user)
        // Redirect user to another page, show success message, etc.
      })
      .catch(error => {
        setsubmitButtonDisabled(false);
        setErrorMsg(error.message); // Display Firebase error message to user
        console.error("Signup failed:", error);
      });
  };
  
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>Signup</div>
        <div className={styles.underline}></div>
      </div>
      <div className={styles.inputs}>
        <b className={styles.error}>{errorMsg}</b>
        <div className={styles.input}>
          <img src={person_icon} alt="" />
          <input type="text" id="username" name="username" placeholder='Username' onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))} />
        </div>
      </div>
      <div className={styles.inputs}>
        <div className={styles.input}>
          <img src={email_icon} alt="" />
          <input type="email" id="email" name="email" placeholder='Email' onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))} />
        </div>
      </div>
      <div className={styles.inputs}>
        <div className={styles.input}>
          <img src={password_icon} alt="" />
          <input type="password" id="password" name="password" placeholder='Password' onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))} />
        </div>
      </div>
      
      <div className={styles['forgot-password']}>Already have an account? <span><Link to="/">Login</Link></span></div>
      <div className={styles['submit-container']}>
        <div className={styles.submit} onClick={handleSubmission} disabled = {submitButtonDisabled} >Signup</div>
      </div>
    </div>
  );
};

export default Signup;
