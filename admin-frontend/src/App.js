import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={< MenuAdmin/>} />
        <Route path="/admin/user-management" element={< UserManagementAdmin/>} />
        <Route path="/admin/machine-management" element={< ActiveMachineAdmin/>} />
        <Route path="/admin/transaction-log" element={< TransactionlogAdmin/>} />
        <Route path="/admin/dashboard/manage-students" element={<StudentsPage />} />
        <Route path="/admin/dashboard/manage-departmentmembers" element={<DepartmentMembersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
