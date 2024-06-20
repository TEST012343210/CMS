// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

const getUsers = () => {
  return axios.get(API_URL, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  })
  .then(response => {
    console.log('Fetched users from API:', response.data);
    return response;
  })
  .catch(error => {
    console.error('Error fetching users from API:', error.response?.data || error.message);
    throw error;
  });
};

const deleteUser = (userId) => {
  return axios.delete(`${API_URL}/${userId}`, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  })
  .then(response => {
    console.log('Deleted user from API:', response.data);
    return response;
  })
  .catch(error => {
    console.error('Error deleting user from API:', error.response?.data || error.message);
    throw error;
  });
};

const banUser = (userId) => {
  return axios.patch(`${API_URL}/${userId}/ban`, {}, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  })
  .then(response => {
    console.log('Banned user from API:', response.data);
    return response;
  })
  .catch(error => {
    console.error('Error banning user from API:', error.response?.data || error.message);
    throw error;
  });
};

const unbanUser = (userId) => {
  return axios.patch(`${API_URL}/${userId}/unban`, {}, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  })
  .then(response => {
    console.log('Unbanned user from API:', response.data);
    return response;
  })
  .catch(error => {
    console.error('Error unbanning user from API:', error.response?.data || error.message);
    throw error;
  });
};

export { getUsers, deleteUser, banUser, unbanUser };
