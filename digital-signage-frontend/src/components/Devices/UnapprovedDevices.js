// src/components/Devices/UnapprovedDevices.js
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getUnapprovedDevices, approveDevice, deleteDevice } from '../../services/deviceService';
import { toast } from 'react-toastify';

const UnapprovedDevices = () => {
  const theme = useTheme();
  console.log('Current theme:', theme);

  const [devices, setDevices] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [code, setCode] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [firmwareVersion, setFirmwareVersion] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [modelName, setModelName] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await getUnapprovedDevices();
      console.log(response.data);  // Add this line for debugging
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices', error.response?.data || error.message);
      toast.error('Error fetching devices');
    }
  };

  const handleManageClick = (device) => {
    console.log('Managing device:', device);
    setSelectedDevice(device);
    setDeviceName(device.name);
    setLocationId(device.locationId || '');
    setBrand(device.brand || 'Unknown');
    setModel(device.model || 'Unknown');
    setCapacity(device.capacity || 'Unknown');
    setFirmwareVersion(device.firmwareVersion || 'Unknown');
    setMacAddress(device.macAddress || 'Unknown');
    setIpAddress(device.ipAddress || 'Unknown');
    setSerialNumber(device.serialNumber || 'Unknown');
    setModelName(device.modelName || 'Unknown');
    setCode('');
    setOpen(true);
  };

  const handleApprove = async () => {
    try {
      console.log('Approving device:', selectedDevice._id, deviceName, locationId, code);
      await approveDevice(selectedDevice._id, deviceName, locationId, code, brand, model, capacity, firmwareVersion, macAddress, ipAddress, serialNumber, modelName);
      toast.success('Device approved and updated successfully');
      setOpen(false);
      fetchDevices(); // Refresh the list of unapproved devices
    } catch (error) {
      console.error('Error approving device', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Error approving device: ${error.response.data.msg || 'Unknown error'}`);
      } else {
        toast.error('Error approving device: Network error');
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (deviceId) => {
    try {
      await deleteDevice(deviceId);
      setDevices(devices.filter(device => device._id !== deviceId));
      toast.success('Device deleted successfully');
    } catch (error) {
      console.error('Error deleting device', error.response?.data || error.message);
      toast.error('Error deleting device');
    }
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Unapproved Devices
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
                <Button variant="contained" onClick={() => handleManageClick(device)}>
                  Manage Device
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleDelete(device._id)} 
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Manage Device</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            label="Location ID"
            fullWidth
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleApprove} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UnapprovedDevices;
