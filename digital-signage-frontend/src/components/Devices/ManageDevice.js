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
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [firmwareVersion, setFirmwareVersion] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [modelName, setModelName] = useState('');

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await getDeviceById(id);
        setDevice(response.data);
        setDeviceName(response.data.name);
        setLocationId(response.data.locationId || '');
        setBrand(response.data.brand || 'Unknown');
        setModel(response.data.model || 'Unknown');
        setCapacity(response.data.capacity || 'Unknown');
        setFirmwareVersion(response.data.firmwareVersion || 'Unknown');
        setMacAddress(response.data.macAddress || 'Unknown');
        setIpAddress(response.data.ipAddress || 'Unknown');
        setSerialNumber(response.data.serialNumber || 'Unknown');
        setModelName(response.data.modelName || 'Unknown');
      } catch (error) {
        console.error('Error fetching device', error.response?.data || error.message);
        toast.error('Error fetching device');
      }
    };

    fetchDevice();
  }, [id]);

  const handleApprove = async () => {
    try {
      await updateDeviceDetails(device._id, deviceName, locationId, brand, model, capacity, firmwareVersion, macAddress, ipAddress, serialNumber, modelName);
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
      <Typography variant="h6" gutterBottom>
        Device Specifications
      </Typography>
      <TextField
        margin="dense"
        label="Brand"
        fullWidth
        value={brand}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: '#f0f0f0' },
        }}
      />
      <TextField
        margin="dense"
        label="Model"
        fullWidth
        value={model}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: '#f0f0f0' },
        }}
      />
      <TextField
        margin="dense"
        label="Capacity"
        fullWidth
        value={capacity}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: '#f0f0f0' },
        }}
      />
      <TextField
        margin="dense"
        label="Firmware Version"
        fullWidth
        value={firmwareVersion}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: '#f0f0f0' },
        }}
      />
      <TextField
        margin="dense"
        label="MAC Address"
        fullWidth
        value={macAddress}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: '#f0f0f0' },
        }}
      />
      <TextField
        margin="dense"
        label="IP Address"
        fullWidth
        value={ipAddress}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: '#f0f0f0' },
        }}
      />
      <TextField
        margin="dense"
        label="Device Serial Number"
        fullWidth
        value={serialNumber}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: '#f0f0f0' },
        }}
      />
      <TextField
        margin="dense"
        label="Device Model Name"
        fullWidth
        value={modelName}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: '#f0f0f0' },
        }}
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
