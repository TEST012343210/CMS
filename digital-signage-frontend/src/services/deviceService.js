// src/services/deviceService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/devices';

// Fetch all devices with authentication
const getAllDevices = () => {
  return axios.get(API_URL, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
  });
};

// Fetch unapproved devices with authentication
const getUnapprovedDevices = () => {
  return axios.get(`${API_URL}/unapproved`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
  });
};

// Approve a device with authentication
const approveDevice = (deviceId, name, locationId, code, brand, model, capacity, firmwareVersion, macAddress, ipAddress, serialNumber, modelName) => {
  return axios.patch(`${API_URL}/${deviceId}/approve`, { 
    name, 
    locationId, 
    code, 
    brand, 
    model, 
    capacity, 
    firmwareVersion, 
    macAddress, 
    ipAddress,
    serialNumber,
    modelName 
  }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
  });
};

// Delete a device with authentication
const deleteDevice = (deviceId) => {
  return axios.delete(`${API_URL}/${deviceId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
  });
};

// Update device details with authentication
const updateDeviceDetails = (deviceId, name, locationId, brand, model, capacity, firmwareVersion, macAddress, ipAddress, serialNumber, modelName) => {
  return axios.patch(`${API_URL}/${deviceId}/details`, { 
    name, 
    locationId, 
    brand, 
    model, 
    capacity, 
    firmwareVersion, 
    macAddress, 
    ipAddress,
    serialNumber,
    modelName 
  }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
  });
};

// Fetch a device by ID with authentication
const getDeviceById = (deviceId) => {
  return axios.get(`${API_URL}/${deviceId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export { getAllDevices, getUnapprovedDevices, approveDevice, deleteDevice, updateDeviceDetails, getDeviceById };
