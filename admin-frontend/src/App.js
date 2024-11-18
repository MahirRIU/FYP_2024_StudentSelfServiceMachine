import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginAdmin from './pages/login-admin/login-admin';
import MenuAdmin from './pages/menu-admin/menu-admin';
import UserManagementAdmin from './pages/user-management-admin/user-management-admin';
import ActiveMachineAdmin from './pages/active-machine-admin/active-machine-admin';
import TransactionlogAdmin from './pages/transaction-log-admin/transaction-log-admin';
import StudentsPage from './pages/students-management/StudentsPage';
import DepartmentMembersPage from './pages/dept-management/DepartmentMembersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Protected Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute><MenuAdmin /></PrivateRoute>} />
        <Route path="/admin/user-management" element={<PrivateRoute><UserManagementAdmin /></PrivateRoute>} />
        <Route path="/admin/machine-management" element={<PrivateRoute><ActiveMachineAdmin /></PrivateRoute>} />
        <Route path="/admin/transaction-log" element={<PrivateRoute><TransactionlogAdmin /></PrivateRoute>} />
        <Route path="/admin/dashboard/manage-students" element={<PrivateRoute><StudentsPage /></PrivateRoute>} />
        <Route path="/admin/dashboard/manage-departmentmembers" element={<PrivateRoute><DepartmentMembersPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

/**
 * PrivateRoute component
 * Redirects unauthenticated users to the login page.
 */
function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('adminAuthToken'); // Check if admin is authenticated
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default App;
