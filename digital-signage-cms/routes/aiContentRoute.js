const express = require('express');
const router = express.Router();
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

router.post('/generate-content', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await hf.textGeneration({
      model: 'distilgpt2',
      inputs: prompt,
      parameters: { 
        max_new_tokens: 100, 
        temperature: 0.7, 
        top_p: 0.9, 
        repetition_penalty: 1.2 
      },
    });

    const generatedText = response.generated_text;
    res.json({ content: generatedText });
  } catch (error) {
    console.error('Error generating content:', error.message, error.response ? error.response.data : '');
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

module.exports = router;
