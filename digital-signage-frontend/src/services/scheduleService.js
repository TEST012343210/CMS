// src/services/scheduleService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/schedule'; // Ensure this points to the correct backend URL

const createSchedule = (name, contentIds, dynamicContentIds, rule, token) => {
  return axios.post(
    API_URL,
    { name, contentIds, dynamicContentIds, rule },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
};

const getAllSchedules = (token) => {
  return axios.get(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
};

const getScheduleById = (id, token) => {
  return axios.get(`${API_URL}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
};

const updateSchedule = (id, name, contentIds, dynamicContentIds, rule, token) => {
  return axios.put(
    `${API_URL}/${id}`,
    { name, contentIds, dynamicContentIds, rule },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
};

const deleteSchedule = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
};

export { createSchedule, getAllSchedules, getScheduleById, updateSchedule, deleteSchedule };
