import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography, Button, Modal, Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, FormControlLabel } from '@mui/material';
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
    position: 'absolute !important', // Add !important to ensure it overrides other styles
    top: '10px',
    right: '10px',
  },
});

const CreateSchedule = ({ token }) => {
  const classes = useStyles();
  const [content, setContent] = useState([]);
  const [dynamicContent, setDynamicContent] = useState([]);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [selectedDynamicContentIds, setSelectedDynamicContentIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!token) {
          throw new Error('No auth token found in localStorage');
        }

        const contentResponse = await axios.get('http://localhost:3000/api/content', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContent(contentResponse.data);

        const dynamicContentResponse = await axios.get('http://localhost:3000/api/dynamic-content', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDynamicContent(dynamicContentResponse.data);
      } catch (error) {
        console.error('Error fetching content', error.response?.data || error.message);
      }
    };

    fetchContent();
  }, [token]);

  const handleCheckboxClick = (id, isDynamic) => {
    if (isDynamic) {
      const selectedIndex = selectedDynamicContentIds.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedDynamicContentIds, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedDynamicContentIds.slice(1));
      } else if (selectedIndex === selectedDynamicContentIds.length - 1) {
        newSelected = newSelected.concat(selectedDynamicContentIds.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selectedDynamicContentIds.slice(0, selectedIndex), selectedDynamicContentIds.slice(selectedIndex + 1));
      }

      setSelectedDynamicContentIds(newSelected);
    } else {
      const selectedIndex = selectedContentIds.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedContentIds, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedContentIds.slice(1));
      } else if (selectedIndex === selectedContentIds.length - 1) {
        newSelected = newSelected.concat(selectedContentIds.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selectedContentIds.slice(0, selectedIndex), selectedContentIds.slice(selectedIndex + 1));
      }

      setSelectedContentIds(newSelected);
    }
  };

  const isSelected = (id, isDynamic) => isDynamic ? selectedDynamicContentIds.indexOf(id) !== -1 : selectedContentIds.indexOf(id) !== -1;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateSchedule = async () => {
    if (!scheduleName) {
      alert('Schedule name is required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/schedule',
        { name: scheduleName, contentIds: selectedContentIds, dynamicContentIds: selectedDynamicContentIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleClose();
    } catch (error) {
      console.error('Error creating schedule', error.response?.data || error.message);
    }
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Create Schedule
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create New Schedule
      </Button>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <Box className={classes.modalContent}>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Schedule Name
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            placeholder="Enter schedule name"
          />
          <Typography variant="h6" gutterBottom>
            Select Content for Schedule
          </Typography>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">Select</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map((item) => {
                const isItemSelected = isSelected(item._id, false);
                return (
                  <TableRow key={item._id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleCheckboxClick(item._id, false)}
                        inputProps={{ 'aria-labelledby': `content-checkbox-${item._id}` }}
                      />
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.type}</TableCell>
                  </TableRow>
                );
              })}
              {dynamicContent.map((item) => {
                const isItemSelected = isSelected(item._id, true);
                return (
                  <TableRow key={item._id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleCheckboxClick(item._id, true)}
                        inputProps={{ 'aria-labelledby': `dynamic-content-checkbox-${item._id}` }}
                      />
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.type}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button variant="contained" color="primary" onClick={handleCreateSchedule}>
            Create Schedule
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default CreateSchedule;
