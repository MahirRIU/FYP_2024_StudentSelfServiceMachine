import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from "./components/Home/Home.js";
import Login1 from "./components/Login1/login1.js";
import Signup from "./components/signup/signup.js";
import MainScreen from './components/pages/mainscreen.js';
import Logout from './components/pages/logout.js';
import Analytics from './components/pages/analytics.js';
import Dashboard from './components/pages/dashboard.js';
import Comment from './components/pages/comments.js';
import About from './components/pages/about.js';
import Payment from './components/pages/PaymentPage.js';
import PDFPageCounter from './components/pages/PDFPageCounter.js';
import DeptDashboard from './components/pages/dept_dashboard.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);

  // Load user data from localStorage on app start
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUser(parsedUserData.user); // Load user data from localStorage
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUser(null); // Clear user data
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login1 setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Role-based Protected Routes */}
          <Route
            path="/pdfpagecounter"
            element={<PrivateRoute user={user} roles={['student']}><PDFPageCounterWrapper /></PrivateRoute>}
          />
          <Route
            path="/paymentpage"
            element={<PrivateRoute user={user} roles={['student']}><Payment /></PrivateRoute>}
          />
          <Route
            path="/logout"
            element={<PrivateRoute user={user}><Logout handleLogout={handleLogout} /></PrivateRoute>}
          />
          <Route
            path="/Clearnessform"
            element={<PrivateRoute user={user} roles={['student']}><Analytics /></PrivateRoute>}
          />
          <Route
            path="/comment"
            element={<PrivateRoute user={user} roles={['deptMember', 'student']}><Comment /></PrivateRoute>}
          />
          <Route
            path="/transcript"
            element={<PrivateRoute user={user} roles={['student']}><About /></PrivateRoute>}
          />
          <Route
            path="/userdashboard"
            element={<PrivateRoute user={user} roles={['student']}><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/mainscreen"
            element={<PrivateRoute user={user}><MainScreen /></PrivateRoute>}
          />
          <Route
            path="/deptmemberdashboard"
            element={<PrivateRoute user={user} roles={['deptMember']}><DeptDashboard /></PrivateRoute>}
          />
        </Routes>
      </Router>
    </div>
  );
}

function PrivateRoute({ children, user, roles }) {
  if (!user) {
    console.log("User not authenticated, redirecting to login.");
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    console.log(`User role "${user.role}" is not authorized for this route.`);
    return <Navigate to="/" replace />;
  }

  console.log("Access granted to user with role:", user.role);
  return children;
}

function PDFPageCounterWrapper() {
  const location = useLocation();
  const { state } = location;

  if (!state || !state.pdfUrl) {
    return <Navigate to="/" replace />;
  }

  return <PDFPageCounter pdfUrl={state.pdfUrl} />;
}

export default App;
