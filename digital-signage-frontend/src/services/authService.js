// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

const register = (name, email, password, role) => {
  return axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    role,
  });
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    if (response.data && response.data.token && response.data.user) {
      localStorage.setItem('authToken', response.data.token); // Store the token
      localStorage.setItem('role', response.data.user.role); // Store user role
    }
    return response;
  } catch (error) {
    console.error('Login error', error);
    throw error;
  }
};

export { register, login };
