// src/components/Auth/Login.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../services/authService';
import { Button, TextField, Typography, Container, Snackbar, Alert } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await login(values.email, values.password);
        console.log('Login successful', response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role); // Store user role
        setOpenSuccess(true);
        setSubmitting(false);
        // Delay navigation to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500); // Short delay before navigation
      } catch (error) {
        console.error('Error logging in', error.response?.data || error.message);
        if (error.response && error.response.status === 403) {
          setErrorMessage('Your access was banned');
        } else {
          setErrorMessage('Invalid email or password');
        }
        setErrors({ submit: errorMessage });
        setOpenError(true);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    let timer;
    if (openSuccess) {
      // Set a timer to close the success Snackbar after 6000ms
      timer = setTimeout(() => {
        setOpenSuccess(false);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [openSuccess]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Email"
          type="email"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          {...formik.getFieldProps('password')}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          fullWidth
          margin="normal"
        />
        {formik.errors.submit && <Typography color="error">{formik.errors.submit}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={formik.isSubmitting}>
          Login
        </Button>
      </form>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setOpenSuccess(false)}>
        <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{ width: '100%', fontSize: '1.2rem', padding: '10px 20px' }}>
          Login Successful
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={() => setOpenError(false)}>
        <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: '100%', fontSize: '1.2rem', padding: '10px 20px' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
