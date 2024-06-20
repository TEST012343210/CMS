// src/services/deviceService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/devices';

// Fetch all devices with authentication
const getAllDevices = () => {
  return axios.get(API_URL, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
};

// Fetch unapproved devices with authentication
const getUnapprovedDevices = () => {
  return axios.get(`${API_URL}/unapproved`, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
};

// Approve a device with authentication
const approveDevice = (deviceId) => {
  return axios.patch(`${API_URL}/${deviceId}/approve`, {}, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
};

// Delete a device with authentication
const deleteDevice = (deviceId) => {
  return axios.delete(`${API_URL}/${deviceId}`, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
};

// Update device details with authentication
const updateDeviceDetails = (deviceId, name, locationId) => {
  return axios.patch(`${API_URL}/${deviceId}/details`, { name, locationId }, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
};

export { getAllDevices, getUnapprovedDevices, approveDevice, deleteDevice, updateDeviceDetails };
