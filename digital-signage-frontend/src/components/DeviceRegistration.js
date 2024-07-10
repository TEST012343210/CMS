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

        // Mock data for the new fields for testing purposes
        const deviceData = {
          identifier,
          clientId: 'TEST_CLIENT_ID',
          name: 'Test Device',
          approved: false,
          code: Math.floor(100000 + Math.random() * 900000).toString(),
          locationId: 'TestLocation',
          brand: 'TestBrand',
          model: 'TestModel',
          capacity: 'TestCapacity',
          firmwareVersion: '1.0.0',
          macAddress: '00:14:22:01:23:45',
          ipAddress: '192.168.1.2'
        };

        const response = await axios.post('http://localhost:3000/api/registerDevice', deviceData);
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
