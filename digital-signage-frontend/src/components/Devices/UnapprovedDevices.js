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

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await getUnapprovedDevices();
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
    setCode('');
    setOpen(true);
  };

  const handleApprove = async () => {
    try {
      console.log('Approving device:', selectedDevice._id, deviceName, locationId, code);
      await approveDevice(selectedDevice._id, deviceName, locationId, code);
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
