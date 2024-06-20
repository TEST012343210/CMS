// src/services/contentService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/content';

const createContent = (title, type, url, token) => {
  return axios.post(
    API_URL,
    { title, type, url },
    { headers: { 'x-auth-token': token } }
  );
};

const getAllContent = (token) => {
  return axios.get(API_URL, { headers: { 'x-auth-token': token } });
};

export { createContent, getAllContent };
