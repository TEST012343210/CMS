import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import { toast } from 'react-toastify';

const RegisterDevice = () => {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [code, setCode] = useState('');

  const registerDevice = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        throw new Error('No auth token found in localStorage');
      }

      const response = await axios.get('http://localhost:3000/api/devices/register', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      console.log('Device registered successfully:', response.data);
      if (response.data && response.data.code) {
        setCode(response.data.code);
      }
      toast.success(`Device registered: ${response.data.identifier}`);
      setRegistered(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Authentication failed. Please log in again.');
        toast.error('Authentication failed. Please log in again.');
      } else if (error.response && error.response.status === 429) {
        console.error('Too many requests. Please try again later.');
        toast.error('Too many requests. Please try again later.');
      } else {
        console.error('Error registering device:', error.response?.data || error.message);
        toast.error('Error registering device');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('authToken', token);
    }
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      {!registered ? (
        <>
          <Button 
            variant="contained" 
            onClick={registerDevice} 
            disabled={loading}
          >
            Register Device
          </Button>
          {loading && <CircularProgress style={{ marginTop: '20px' }} />}
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