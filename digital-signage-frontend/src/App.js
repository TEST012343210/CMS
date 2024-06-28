// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ContentList from './components/Content/ContentList';
import ContentForm from './components/Content/ContentForm';
import Home from './components/Home';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import Users from './components/Dashboard/Users';
import ManageContent from './components/Dashboard/ManageContent';
import CreateSchedule from './components/Dashboard/CreateSchedule';
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
  const token = localStorage.getItem('authToken'); // Updated to authToken
  const role = localStorage.getItem('role');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                <Route path="upload-content" element={<ContentForm token={token} />} />
                <Route path="manage-content" element={<ManageContent token={token} />} />
                <Route path="create-schedule" element={<CreateSchedule token={token} />} />
                <Route path="manage-schedules" element={<ManageSchedules token={token} />} />
              </Route>
            </Routes>
            <ToastContainer />
          </ErrorBoundary>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
