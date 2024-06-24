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
        const response = await axios.get('http://localhost:3000/api/devices/register');
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
        if (error.response && error.response.status === 429) {
          console.warn(`429 response received. Retry count: ${retryCount}`);
          if (retryCount < 3) { // Retry only a few times
            setRetryCount(retryCount + 1);
            setLoading(true);
            setTimeout(registerDevice, 2000); // Retry after 2 seconds
          } else {
            if (isMounted) {
              console.error('Too many attempts, please try again later.');
              toast.error('Too many attempts, please try again later.');
              setLoading(false);
            }
          }
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
