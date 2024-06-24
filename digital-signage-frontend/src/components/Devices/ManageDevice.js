// src/components/Devices/ManageDevice.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { updateDeviceDetails, approveDevice, getDeviceById } from '../../services/deviceService';
import { toast } from 'react-toastify';

const ManageDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deviceName, setDeviceName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [code, setCode] = useState('');
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await getDeviceById(id);
        setDevice(response.data);
        setDeviceName(response.data.name);
        setLocationId(response.data.locationId || '');
      } catch (error) {
        console.error('Error fetching device', error.response?.data || error.message);
        toast.error('Error fetching device');
      }
    };

    fetchDevice();
  }, [id]);

  const handleApprove = async () => {
    try {
      await updateDeviceDetails(device._id, deviceName, locationId);
      await approveDevice(device._id, code); // Pass the code for verification
      toast.success('Device approved and updated successfully');
      navigate('/dashboard/unapproved-devices');
    } catch (error) {
      console.error('Error approving device', error.response?.data || error.message);
      toast.error('Error approving device');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/unapproved-devices');
  };

  return (
    <Paper style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Manage Device
      </Typography>
      <TextField
        margin="dense"
        label="Name"
        fullWidth
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
      />
      <TextField
        margin="dense"
        label="Location ID"
        fullWidth
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
      />
      <TextField
        margin="dense"
        label="Code"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleApprove} style={{ marginTop: 16 }}>
        Approve
      </Button>
      <Button variant="contained" color="default" onClick={handleCancel} style={{ marginTop: 16, marginLeft: 8 }}>
        Cancel
      </Button>
    </Paper>
  );
};

export default ManageDevice;
