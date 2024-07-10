// frontend/src/components/AIContentCreation.js

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, Paper } from '@mui/material';
import { generateAIContent, createContent } from '../services/contentService';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(4),
    outline: 'none',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
  },
}));

const AIContentCreation = ({ token }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();

  const handleGenerateContent = async () => {
    try {
      const response = await generateAIContent({ prompt });
      setGeneratedContent(response.content);
      setOpenModal(true);
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
        usedPrompt: prompt,
        apiUrl: 'http://localhost:3000/api/ai-content/generate-content',
      };
      await createContent(contentData, token);
      setOpenModal(false);
      navigate('/dashboard/manage-content');
    } catch (error) {
      console.error('Error saving AI content', error.response?.data || error.message);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper className={classes.modalContent}>
          <Typography variant="h6">Generated Content</Typography>
          <Typography>{generatedContent}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="secondary" onClick={handleGenerateContent}>
              Generate Again
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveContent}>
              Save
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default AIContentCreation;
