// src/services/scheduleService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/schedule';

const createSchedule = (content, startTime, endTime, token) => {
  return axios.post(
    API_URL,
    { content, startTime, endTime },
    { headers: { 'x-auth-token': token } }
  );
};

const getAllSchedules = (token) => {
  return axios.get(API_URL, { headers: { 'x-auth-token': token } });
};

export { createSchedule, getAllSchedules };
