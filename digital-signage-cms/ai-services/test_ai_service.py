const axios = require('axios');

const generateContent = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/ai-content/generate-content', {
      prompt: 'Describe an AI-generated image of a sunset over a mountain range.',
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
};

generateContent();
