import React, { useEffect, useState } from 'react';
import { getAllDynamicContent, createDynamicContent, updateDynamicContent, deleteDynamicContent } from '../../services/dynamicContentService';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Checkbox, Button, Modal, Box, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '1rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'auto',
  },
  closeButton: {
    position: 'absolute !important',
    top: '10px',
    right: '10px',
  },
});

const ManageDynamicContent = ({ token }) => {
  const classes = useStyles();
  const [dynamicContent, setDynamicContent] = useState([]);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [contentType, setContentType] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [updateInterval, setUpdateInterval] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const fetchDynamicContent = async () => {
      try {
        const response = await getAllDynamicContent(token);
        setDynamicContent(response.data || []); // Ensure dynamicContent is an array
      } catch (error) {
        console.error('Error fetching dynamic content', error.response?.data || error.message);
      }
    };

    fetchDynamicContent();
  }, [token]);

  const handleCheckboxClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleOpen = (content) => {
    if (content) {
      setEditMode(true);
      setCurrentId(content._id);
      setContentType(content.contentType);
      setApiUrl(content.apiUrl);
      setUpdateInterval(content.updateInterval);
    } else {
      setEditMode(false);
      setCurrentId(null);
      setContentType('');
      setApiUrl('');
      setUpdateInterval('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setContentType('');
    setApiUrl('');
    setUpdateInterval('');
  };

  const handleSaveContent = async () => {
    try {
      if (editMode) {
        await updateDynamicContent(currentId, { contentType, apiUrl, updateInterval }, token);
      } else {
        await createDynamicContent({ contentType, apiUrl, updateInterval }, token);
      }
      const response = await getAllDynamicContent(token);
      setDynamicContent(response.data || []); // Ensure dynamicContent is an array
      handleClose();
    } catch (error) {
      console.error('Error saving dynamic content', error.response?.data || error.message);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const id of selected) {
        await deleteDynamicContent(id, token);
      }
      setDynamicContent(dynamicContent.filter((content) => !selected.includes(content._id)));
      setSelected([]);
    } catch (error) {
      console.error('Error deleting dynamic content', error.response?.data || error.message);
    }
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Manage Dynamic Content
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleDeleteSelected} disabled={selected.length === 0}>
        Delete Selected
      </Button>
      <Button variant="contained" color="primary" onClick={() => handleOpen(null)}>
        Add New Content
      </Button>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < dynamicContent.length}
                checked={dynamicContent.length > 0 && selected.length === dynamicContent.length}
                onChange={(event) => {
                  if (event.target.checked) {
                    const newSelected = dynamicContent.map((content) => content._id);
                    setSelected(newSelected);
                  } else {
                    setSelected([]);
                  }
                }}
                inputProps={{ 'aria-label': 'select all dynamic content' }}
              />
            </TableCell>
            <TableCell>Content Type</TableCell>
            <TableCell>API URL</TableCell>
            <TableCell>Update Interval</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dynamicContent && dynamicContent.length > 0 ? (
            dynamicContent.map((content) => {
              const isItemSelected = isSelected(content._id);
              return (
                <TableRow key={content._id} selected={isItemSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => handleCheckboxClick(content._id)}
                      inputProps={{ 'aria-labelledby': `dynamic-content-checkbox-${content._id}` }}
                    />
                  </TableCell>
                  <TableCell>{content.contentType}</TableCell>
                  <TableCell>{content.apiUrl}</TableCell>
                  <TableCell>{content.updateInterval}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpen(content)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No dynamic content available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <Box className={classes.modalContent}>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            {editMode ? 'Edit Dynamic Content' : 'Add New Dynamic Content'}
          </Typography>
          <TextField
            label="Content Type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="API URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Update Interval (in minutes)"
            value={updateInterval}
            onChange={(e) => setUpdateInterval(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSaveContent}>
            Save
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default ManageDynamicContent;
