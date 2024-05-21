import React from 'react';
import './login.css';
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";

const Login = () => {
    return (
        <div className='container'>
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    {/* <label htmlFor="email">Email:</label> */}
                    <input type="email" id="email" name="email" placeholder='Email' />
                </div>
            </div>
            
            <div className="inputs">
                <div className="input">
                    <img src={password_icon} alt="" />
                    {/* <label htmlFor="password">Password:</label> */}
                    <input type="password" id="password" name="password" placeholder='password'/>
                </div>
            </div>
            
            <div className="forgot-password">Forgot password? <span>Click here!</span></div>
            
            <div className="submit-container">
                <div className="submit">Login</div>
            </div>
        </div>
    );
};

export default Login;
