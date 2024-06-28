import axios from 'axios';

const API_URL = 'http://localhost:3000/api/content';

const createContent = async (formData, token) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating content', error.response?.data || error.message);
    throw error;
  }
};

const getAllContent = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content', error.response?.data || error.message);
    throw error;
  }
};

export { createContent, getAllContent };
