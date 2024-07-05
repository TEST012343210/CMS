import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { generateAIContent, createContent } from '../services/contentService';
import { useNavigate } from 'react-router-dom';

const AIContentCreation = ({ token }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const navigate = useNavigate();

  const handleGenerateContent = async () => {
    try {
      const response = await generateAIContent({ prompt });
      setGeneratedContent(response.content);
    } catch (error) {
      console.error('Error generating AI content', error.response?.data || error.message);
    }
  };

  const handleSaveContent = async () => {
    try {
      const contentData = {
        title: 'AI Generated Content',
        contentType: 'ai',
        aiGeneratedContent: generatedContent,
      };
      await createContent(contentData, token);
      navigate('/dashboard/manage-content');
    } catch (error) {
      console.error('Error saving AI content', error.response?.data || error.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Generate AI Content</Typography>
      <TextField
        label="Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleGenerateContent}>
        Generate Content
      </Button>
      {generatedContent && (
        <Box mt={2}>
          <Typography variant="h6">Generated Content</Typography>
          <Typography>{generatedContent}</Typography>
          <Button variant="contained" color="secondary" onClick={handleGenerateContent}>
            Generate Again
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveContent}>
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AIContentCreation;
