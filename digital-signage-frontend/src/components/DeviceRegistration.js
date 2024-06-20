// src/components/DeviceRegistration.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeviceRegistration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const registerDevice = async () => {
      try {
        const { data: devices } = await axios.get('http://localhost:3000/api/devices');
        const identifier = `Display${(devices.length + 1).toString().padStart(4, '0')}`;

        const response = await axios.post('http://localhost:3000/api/devices/register', { identifier });
        console.log('Device registered:', response.data);
        navigate('/dashboard/unapproved-devices');
      } catch (error) {
        console.error('Error registering device:', error.response?.data || error.message);
      }
    };

    registerDevice();
  }, [navigate]);

  return (
    <div>
      <h2>Registering Device...</h2>
    </div>
  );
};

export default DeviceRegistration;
