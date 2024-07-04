import axios from 'axios';

const API_URL = 'http://localhost:3000/api/content';

export const getAllContent = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content', error.response?.data || error.message);
    throw error;
  }
};

export const createContent = async (formData, token) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating content', error.response?.data || error.message);
    throw error;
  }
};

export const updateContent = async (id, contentData, token) => {
  try {
    console.log(`Updating content with ID: ${id}`, contentData);
    const response = await axios.put(`${API_URL}/${id}`, contentData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Update content response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating content', error.response?.data || error.message);
    throw error;
  }
};

export const deleteContent = async (ids, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/delete`,
      { ids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting content', error.response?.data || error.message);
    throw error;
  }
};

export const getDynamicContent = async (contentId, token) => {
  try {
    const response = await axios.get(`${API_URL}/dynamic/${contentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dynamic content', error.response?.data || error.message);
    throw error;
  }
};
