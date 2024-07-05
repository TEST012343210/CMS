import React, { useState } from 'react';
import { Box, Button, Modal, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createContent, generateAIContent } from '../../services/contentService';

const useStyles = makeStyles({
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    padding: '2rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
});

const UploadContent = ({ token }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [contentType, setContentType] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [dynamicContent, setDynamicContent] = useState({ apiUrl: '', updateInterval: '' });
  const [url, setUrl] = useState('');
  const [ssspUrl, setSsspUrl] = useState('');
  const [ftpDetails, setFtpDetails] = useState({ host: '', path: '', username: '', password: '' });
  const [cifsDetails, setCifsDetails] = useState({ host: '', path: '', username: '', password: '' });
  const [streamingUrl, setStreamingUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setContentType('');
    setFile(null);
    setDynamicContent({ apiUrl: '', updateInterval: '' });
    setUrl('');
    setSsspUrl('');
    setFtpDetails({ host: '', path: '', username: '', password: '' });
    setCifsDetails({ host: '', path: '', username: '', password: '' });
    setStreamingUrl('');
    setAiPrompt('');
    setAiGeneratedContent('');
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleDynamicChange = (e) => setDynamicContent({ ...dynamicContent, [e.target.name]: e.target.value });

  const handleGenerateAIContent = async () => {
    try {
      const generatedContent = await generateAIContent({ prompt: aiPrompt });
      setAiGeneratedContent(generatedContent.content);
    } catch (error) {
      console.error('Error generating AI content', error.response?.data || error.message);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('contentType', contentType);
    if (file) formData.append('file', file);
    if (contentType === 'dynamic') {
      formData.append('apiUrl', dynamicContent.apiUrl);
      formData.append('updateInterval', dynamicContent.updateInterval);
    } else if (contentType === 'webpage') {
      formData.append('url', url);
    } else if (contentType === 'sssp-web-app') {
      formData.append('ssspUrl', ssspUrl);
    } else if (contentType === 'ftp') {
      formData.append('ftpDetails', JSON.stringify(ftpDetails));
    } else if (contentType === 'cifs') {
      formData.append('cifsDetails', JSON.stringify(cifsDetails));
    } else if (contentType === 'streaming') {
      formData.append('streamingUrl', streamingUrl);
    } else if (['image', 'video', 'interactive'].includes(contentType)) {
      if (url) {
        formData.append('url', url);
      }
    } else if (contentType === 'ai') {
      formData.append('aiGeneratedContent', aiGeneratedContent);
    }

    try {
      await createContent(formData, token);
      handleClose();
    } catch (error) {
      console.error('Error uploading content', error.response?.data || error.message);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Upload Content
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box className={classes.modalContent}>
          <form onSubmit={handleUpload}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Content Type</InputLabel>
              <Select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="dynamic">Dynamic</MenuItem>
                <MenuItem value="interactive">Interactive</MenuItem>
                <MenuItem value="webpage">Webpage</MenuItem>
                <MenuItem value="sssp-web-app">SSSP Web App</MenuItem>
                <MenuItem value="ftp">FTP</MenuItem>
                <MenuItem value="cifs">CIFS</MenuItem>
                <MenuItem value="streaming">Streaming</MenuItem>
                <MenuItem value="ai">AI</MenuItem>
              </Select>
            </FormControl>

            {contentType === 'dynamic' && (
              <Box>
                <TextField
                  label="API URL"
                  name="apiUrl"
                  value={dynamicContent.apiUrl}
                  onChange={handleDynamicChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Update Interval (in minutes)"
                  name="updateInterval"
                  value={dynamicContent.updateInterval}
                  onChange={handleDynamicChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
            )}

            {['image', 'video', 'interactive'].includes(contentType) && (
              <Box>
                <TextField
                  type="file"
                  onChange={handleFileChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  type="url"
                  label="URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
            )}

            {contentType === 'webpage' && (
              <Box>
                <TextField
                  label="URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Box>
            )}

            {contentType === 'sssp-web-app' && (
              <Box>
                <TextField
                  label="SSSP Web App URL"
                  value={ssspUrl}
                  onChange={(e) => setSsspUrl(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Box>
            )}

            {contentType === 'ftp' && (
              <Box>
                <TextField
                  label="Host"
                  value={ftpDetails.host}
                  onChange={(e) => setFtpDetails({ ...ftpDetails, host: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Path"
                  value={ftpDetails.path}
                  onChange={(e) => setFtpDetails({ ...ftpDetails, path: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Username"
                  value={ftpDetails.username}
                  onChange={(e) => setFtpDetails({ ...ftpDetails, username: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={ftpDetails.password}
                  onChange={(e) => setFtpDetails({ ...ftpDetails, password: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </Box>
            )}

            {contentType === 'cifs' && (
              <Box>
                <TextField
                  label="Host"
                  value={cifsDetails.host}
                  onChange={(e) => setCifsDetails({ ...cifsDetails, host: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Path"
                  value={cifsDetails.path}
                  onChange={(e) => setCifsDetails({ ...cifsDetails, path: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Username"
                  value={cifsDetails.username}
                  onChange={(e) => setCifsDetails({ ...cifsDetails, username: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={cifsDetails.password}
                  onChange={(e) => setCifsDetails({ ...cifsDetails, password: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </Box>
            )}
            
            {contentType === 'streaming' && (
              <Box>
                <TextField
                  label="Streaming URL"
                  value={streamingUrl}
                  onChange={(e) => setStreamingUrl(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Box>
            )}

            {contentType === 'ai' && (
              <Box>
                <TextField
                  label="AI Prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button variant="contained" color="primary" onClick={handleGenerateAIContent}>
                  Generate Content
                </Button>
                {aiGeneratedContent && (
                  <TextField
                    label="AI Generated Content"
                    value={aiGeneratedContent}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </Box>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Upload
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default UploadContent;
