const axios = require('axios');
require('dotenv').config();

const testConnection = async () => {
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      prompt: 'Say this is a test',
      max_tokens: 5
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Test connection response:', response.data);
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error config:', error.config);
    }
  }
};

testConnection();
