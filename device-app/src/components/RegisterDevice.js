// src/components/RegisterDevice.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';

const RegisterDevice = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const registerDevice = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/devices/register');
        console.log('Device registered:', response.data);
        toast.success(`Device registered: ${response.data.identifier}`);
        setLoading(false);
        // Redirect to an appropriate page after registration
        navigate('/unapproved-devices');
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.warn('Retrying registration due to 429 response');
          setTimeout(registerDevice, 2000); // Retry after 2 seconds
        } else {
          console.error('Error registering device:', error.response?.data || error.message);
          toast.error('Error registering device');
          setLoading(false);
        }
      }
    };

    registerDevice();
  }, [navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      {loading ? (
        <>
          <CircularProgress />
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Registering Device...
          </Typography>
        </>
      ) : (
        <Typography variant="h6">
          Device Registered Successfully
        </Typography>
      )}
    </Box>
  );
};

export default RegisterDevice;
