const axios = require('axios');

const generateContent = async () => {
  try {
    console.log('Sending request to generate content...');
    const response = await axios.post('http://localhost:3000/api/ai-content/generate-content', {
      prompt: 'Describe a breathtaking AI-generated image of a sunset over a mountain range. The colors, the mood, and the atmosphere should be detailed.'
    });
    console.log('Generated Content:', response.data);
  } catch (error) {
    console.error('Error:', error.message, error.response ? error.response.data : '');
  }
};

generateContent();
