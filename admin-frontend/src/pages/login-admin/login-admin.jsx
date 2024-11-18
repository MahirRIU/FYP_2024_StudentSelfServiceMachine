import React, { useState } from 'react';
import './login-admin.css';
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../../components/LoadingBar';
import logo from '../../assets/logos/sssm.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Person from '@mui/icons-material/Person';
import Lock from '@mui/icons-material/Lock';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LoginAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const navigateToDashboard = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin/dashboard');
    }, 1500);
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'The username field is required.';
    if (!password.trim()) errors.password = 'The password field is required.';
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = validateLoginForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role: 'admin' }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('Login Successful!');
        localStorage.setItem('adminName', data.user.name);
        localStorage.setItem('adminAuthToken', data.token);
        navigateToDashboard();
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (field) => {
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  return (
    <div>
      {isLoading && <LoadingBar />}
      <div className="top-bar">
        <h5>LOGIN AS AN ADMINISTRATOR</h5>
      </div>
      <div className="login-container">
        <div className="left-section">
          <img src={logo} alt="Logo" className="logo-top" />
        </div>
        <div className="right-section">
          {error && (
            <p className={`message ${error === 'Login Successful!' ? 'success-message' : 'error-message'}`}>
              {error === 'Login Successful!' ? <CheckCircleIcon className="success-icon" /> : <ErrorIcon className="error-icon" />}
              {error}
            </p>
          )}
          <form className="login-form" onSubmit={handleLogin} noValidate>
            <label htmlFor="username">Username</label>
            <div className="input-container">
              <Person className="input-icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => handleFocus('username')}
                placeholder="Enter your username"
              />
            </div>
            {validationErrors.username && (
              <div className="error-message-container">
                <p className="small-error-message">{validationErrors.username}</p>
              </div>
            )}
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleFocus('password')}
                placeholder="Enter your password"
              />
              <div className="toggle-password" onClick={toggleShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            {validationErrors.password && (
              <div className="error-message-container">
                <p className="small-error-message">{validationErrors.password}</p>
              </div>
            )}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
