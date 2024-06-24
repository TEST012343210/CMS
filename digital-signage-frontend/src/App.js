// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ContentList from './components/Content/ContentList';
import ContentForm from './components/Content/ContentForm';
import Home from './components/Home';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import Users from './components/Dashboard/Users';
import ManageContent from './components/Dashboard/ManageContent';
import ManageSchedules from './components/Dashboard/ManageSchedules';
import Dashboard from './components/Dashboard/Dashboard';
import AllDevices from './components/Devices/AllDevices';
import UnapprovedDevices from './components/Devices/UnapprovedDevices';
import ManageDevice from './components/Devices/ManageDevice';
import DeviceRegistration from './components/DeviceRegistration';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <div className="App">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/content" element={<ContentList token={token} />} />
            <Route path="/create-content" element={<ContentForm token={token} />} />
            <Route path="/register-device" element={<DeviceRegistration />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="all-devices" element={<AllDevices />} />
              <Route path="unapproved-devices" element={<UnapprovedDevices />} />
              <Route path="manage-device/:id" element={<ManageDevice />} />
              {role === 'Admin' && <Route path="users" element={<Users />} />}
              <Route path="content" element={<ManageContent token={token} />} />
              <Route path="create-content" element={<ContentForm token={token} />} />
              <Route path="schedules" element={<ManageSchedules />} />
            </Route>
          </Routes>
          <ToastContainer />
        </ErrorBoundary>
      </div>
    </Router>
  );
};

export default App;
