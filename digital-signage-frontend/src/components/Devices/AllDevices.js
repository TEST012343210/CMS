// src/components/Devices/AllDevices.js
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button
} from '@mui/material';
import { getAllDevices, deleteDevice } from '../../services/deviceService';
import { toast } from 'react-toastify';

const AllDevices = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await getAllDevices();
        setDevices(response.data.filter(device => device.approved)); // Only show approved devices
      } catch (error) {
        console.error('Error fetching devices', error.response?.data || error.message);
        toast.error('Error fetching devices');
      }
    };

    fetchDevices();
  }, []);

  const handleDelete = async (deviceId) => {
    try {
      console.log('Deleting device with ID:', deviceId);
      await deleteDevice(deviceId);
      setDevices(devices.filter((device) => device._id !== deviceId));
      toast.success('Device deleted successfully');
    } catch (error) {
      console.error('Error deleting device', error.response?.data || error.message);
      toast.error('Error deleting device');
    }
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        All Devices
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Identifier</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device._id}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.identifier}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => handleDelete(device._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AllDevices;
