// src/components/Dashboard/ManageSchedules.js

import React, { useEffect, useState } from 'react';
import { getAllSchedules, updateSchedule, deleteSchedule } from '../../services/scheduleService';
import { getAllContent } from '../../services/contentService';
import { getAllDynamicContent } from '../../services/dynamicContentService';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Checkbox, Button, Modal, Box, IconButton } from '@mui/material';
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

const ManageSchedules = ({ token }) => {
  const classes = useStyles();
  const [schedules, setSchedules] = useState([]);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [selectedDynamicContentIds, setSelectedDynamicContentIds] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState([]);
  const [dynamicContent, setDynamicContent] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (!token) {
          throw new Error('No auth token found in localStorage');
        }

        const response = await getAllSchedules(token);
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching schedules', error);
      }
    };

    const fetchContent = async () => {
      try {
        const response = await getAllContent(token);
        setContent(response.data || []); // Ensure content is an array
      } catch (error) {
        console.error('Error fetching content', error);
      }
    };

    const fetchDynamicContent = async () => {
      try {
        const response = await getAllDynamicContent(token);
        setDynamicContent(response.data || []); // Ensure dynamicContent is an array
      } catch (error) {
        console.error('Error fetching dynamic content', error);
      }
    };

    fetchSchedules();
    fetchContent();
    fetchDynamicContent();
  }, [token]);

  const handleCheckboxClick = (id, isContent) => {
    if (isContent) {
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
    } else {
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
    }
  };

  const isSelected = (id, isContent) => isContent ? selectedContentIds.indexOf(id) !== -1 : selectedDynamicContentIds.indexOf(id) !== -1;

  const handleOpen = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedContentIds(schedule.contents.map((content) => content._id));
    setSelectedDynamicContentIds(schedule.dynamicContent.map((content) => content._id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedule(null);
  };

  const handleSaveSchedule = async () => {
    try {
      await updateSchedule(selectedSchedule._id, selectedSchedule.name, selectedContentIds, selectedDynamicContentIds, selectedSchedule.rule, token);
      handleClose();
    } catch (error) {
      console.error('Error updating schedule', error.response?.data || error.message);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const id of [...selectedContentIds, ...selectedDynamicContentIds]) {
        await deleteSchedule(id, token);
      }
      setSchedules(schedules.filter((schedule) => !selectedContentIds.includes(schedule._id) && !selectedDynamicContentIds.includes(schedule._id)));
      setSelectedContentIds([]);
      setSelectedDynamicContentIds([]);
    } catch (error) {
      console.error('Error deleting schedule', error.response?.data || error.message);
    }
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Manage Schedules
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleDeleteSelected} disabled={[...selectedContentIds, ...selectedDynamicContentIds].length === 0}>
        Delete Selected
      </Button>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={[...selectedContentIds, ...selectedDynamicContentIds].length > 0 && [...selectedContentIds, ...selectedDynamicContentIds].length < schedules.length}
                checked={schedules.length > 0 && [...selectedContentIds, ...selectedDynamicContentIds].length === schedules.length}
                onChange={(event) => {
                  if (event.target.checked) {
                    const newSelected = schedules.map((schedule) => schedule._id);
                    setSelectedContentIds(newSelected);
                    setSelectedDynamicContentIds(newSelected);
                  } else {
                    setSelectedContentIds([]);
                    setSelectedDynamicContentIds([]);
                  }
                }}
                inputProps={{ 'aria-label': 'select all schedules' }}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Contents</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((schedule) => {
            const isItemSelected = isSelected(schedule._id, true) || isSelected(schedule._id, false);
            return (
              <TableRow key={schedule._id} selected={isItemSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    onChange={() => handleCheckboxClick(schedule._id, true)}
                    inputProps={{ 'aria-labelledby': `schedule-checkbox-${schedule._id}` }}
                  />
                </TableCell>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>{[...schedule.contents, ...schedule.dynamicContent].map((content) => content.title).join(', ')}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpen(schedule)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <Box className={classes.modalContent}>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          {selectedSchedule && (
            <>
              <Typography variant="h6" gutterBottom>
                Edit Schedule: {selectedSchedule.name}
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
                  {[...(content || []), ...(dynamicContent || [])].map((item) => {
                    const isItemSelected = isSelected(item._id, item.type === 'content');
                    return (
                      <TableRow key={item._id} selected={isItemSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={() => handleCheckboxClick(item._id, item.type === 'content')}
                            inputProps={{ 'aria-labelledby': `content-checkbox-${item._id}` }}
                          />
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.type}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Button variant="contained" color="primary" onClick={handleSaveSchedule}>
                Save
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default ManageSchedules;
