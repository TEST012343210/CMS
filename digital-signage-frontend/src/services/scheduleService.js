// src/services/scheduleService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/schedule'; // Ensure this points to the correct backend URL

const createSchedule = async (name, contentIds, dynamicContentIds, rule, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { name, contentIds, dynamicContentIds, rule },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating schedule', error.response?.data || error.message);
    throw error;
  }
};

const getAllSchedules = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules', error.response?.data || error.message);
    throw error;
  }
};

const getScheduleById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule', error.response?.data || error.message);
    throw error;
  }
};

const updateSchedule = async (id, name, contentIds, dynamicContentIds, rule, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      { name, contentIds, dynamicContentIds, rule },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating schedule', error.response?.data || error.message);
    throw error;
  }
};

const deleteSchedule = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule', error.response?.data || error.message);
    throw error;
  }
};

export { createSchedule, getAllSchedules, getScheduleById, updateSchedule, deleteSchedule };
