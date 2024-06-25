// src/components/RegisterDevice.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';

const RegisterDevice = () => {
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [code, setCode] = useState('');

  useEffect(() => {
    let isMounted = true;
    let requestSent = false;

    const registerDevice = async () => {
      if (requestSent) return;
      requestSent = true;

      console.log(`Attempting to register device... Retry count: ${retryCount}`);
      try {
        // Retrieve the token from wherever it's stored
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No auth token found in localStorage');
        }
        console.log('Token retrieved:', token);

        const response = await axios.get('http://localhost:3000/api/devices/register', {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the request headers
          }
        });

        if (isMounted) {
          console.log('Device registered successfully:', response.data);
          if (response.data && response.data.code) {
            setCode(response.data.code);
            console.log('Code from JSON response:', response.data.code);
          } else {
            console.error('No code in response data');
          }
          toast.success(`Device registered: ${response.data.identifier}`);
          setLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Authentication failed. Please log in again.');
          toast.error('Authentication failed. Please log in again.');
          // Here you might want to redirect the user to a login page
          setLoading(false);
        } else if (error.response && error.response.status === 429) {
          console.error('Too many requests, retrying...');
          setRetryCount(prevCount => prevCount + 1);
        } else {
          if (isMounted) {
            console.error('Error registering device:', error.response?.data || error.message);
            toast.error('Error registering device');
            setLoading(false);
          }
        }
      }
    };

    registerDevice();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

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
      {code && (
        <Typography variant="h4" style={{ marginTop: '20px' }}>
          Code: {code}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterDevice;
