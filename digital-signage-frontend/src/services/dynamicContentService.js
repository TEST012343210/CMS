import axios from 'axios';

const API_URL = 'http://localhost:3000/api/dynamic-data'; // Corrected to match the endpoint

export const getAllDynamicContent = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createDynamicContent = async (data, token) => {
  const response = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateDynamicContent = async (id, data, token) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteDynamicContent = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
