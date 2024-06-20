// src/components/Dashboard/ManageSchedules.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/schedule', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching schedules', error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Schedules
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Content Title</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule._id}>
              <TableCell>{schedule.content.title}</TableCell>
              <TableCell>{new Date(schedule.startTime).toLocaleString()}</TableCell>
              <TableCell>{new Date(schedule.endTime).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ManageSchedules;
