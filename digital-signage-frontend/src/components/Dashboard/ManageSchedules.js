import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    position: 'absolute !important', // Add !important to ensure it overrides other styles
    top: '10px',
    right: '10px',
  },
});

const ManageSchedules = ({ token }) => {
  const classes = useStyles();
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (!token) {
          throw new Error('No auth token found in localStorage');
        }

        const response = await axios.get('http://localhost:3000/api/schedule', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching schedules', error.response?.data || error.message);
      }
    };

    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/content', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content', error.response?.data || error.message);
      }
    };

    fetchSchedules();
    fetchContent();
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

  const handleOpen = (schedule) => {
    setSelectedSchedule(schedule);
    setSelected(schedule.contents.map((content) => content._id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedule(null);
  };

  const handleSaveSchedule = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/schedule/${selectedSchedule._id}`,
        { name: selectedSchedule.name, contentIds: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleClose();
    } catch (error) {
      console.error('Error updating schedule', error.response?.data || error.message);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/schedule/${selected}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(schedules.filter((schedule) => !selected.includes(schedule._id)));
      setSelected([]);
    } catch (error) {
      console.error('Error deleting schedule', error.response?.data || error.message);
    }
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Manage Schedules
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleDeleteSelected} disabled={selected.length === 0}>
        Delete Selected
      </Button>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < schedules.length}
                checked={schedules.length > 0 && selected.length === schedules.length}
                onChange={(event) => {
                  if (event.target.checked) {
                    const newSelected = schedules.map((schedule) => schedule._id);
                    setSelected(newSelected);
                  } else {
                    setSelected([]);
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
            const isItemSelected = isSelected(schedule._id);
            return (
              <TableRow key={schedule._id} selected={isItemSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    onChange={() => handleCheckboxClick(schedule._id)}
                    inputProps={{ 'aria-labelledby': `schedule-checkbox-${schedule._id}` }}
                  />
                </TableCell>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>{schedule.contents.map((content) => content.title).join(', ')}</TableCell>
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
                  {content.map((item) => {
                    const isItemSelected = isSelected(item._id);
                    return (
                      <TableRow key={item._id} selected={isItemSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={() => handleCheckboxClick(item._id)}
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
