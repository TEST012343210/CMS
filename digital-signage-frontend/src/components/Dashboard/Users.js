// src/components/Dashboard/Users.js
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, Button } from '@mui/material';
import { toast } from 'react-toastify';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const roles = ['Admin', 'Content Manager', 'User'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No auth token found in localStorage');
        }

        const response = await axios.get('http://localhost:3000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Fetched users:', response.data);
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error.response?.data || error.message);
        toast.error('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedRoles.length === 0) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => selectedRoles.includes(user.role)));
    }
  }, [selectedRoles, users]);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user', error.response?.data || error.message);
      toast.error('Error deleting user');
    }
  };

  const handleBan = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`http://localhost:3000/api/users/${userId}/ban`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.map(user => user._id === userId ? { ...user, banned: true } : user));
      toast.success('User banned successfully');
    } catch (error) {
      console.error('Error banning user', error.response?.data || error.message);
      toast.error('Error banning user');
    }
  };

  const handleUnban = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`http://localhost:3000/api/users/${userId}/unban`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.map(user => user._id === userId ? { ...user, banned: false } : user));
      toast.success('User unbanned successfully');
    } catch (error) {
      console.error('Error unbanning user', error.response?.data || error.message);
      toast.error('Error unbanning user');
    }
  };

  const handleRoleChange = (event) => {
    const { target: { value } } = event;
    setSelectedRoles(typeof value === 'string' ? value.split(',') : value);
  };

  const clearFilters = () => {
    setSelectedRoles([]);
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-filter-label">Filter by Role</InputLabel>
        <Select
          labelId="role-filter-label"
          id="role-filter"
          multiple
          value={selectedRoles}
          onChange={handleRoleChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              <Checkbox checked={selectedRoles.indexOf(role) > -1} />
              <ListItemText primary={role} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={clearFilters} variant="outlined" color="primary" style={{ marginBottom: '10px' }}>
        Clear Filters
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Select
                  value=""
                  displayEmpty
                  renderValue={() => <MoreVertIcon />}
                  onChange={(event) => {
                    if (event.target.value === 'delete') handleDelete(user._id);
                    if (event.target.value === 'ban') handleBan(user._id);
                    if (event.target.value === 'unban') handleUnban(user._id);
                  }}
                >
                  <MenuItem value="delete">Delete</MenuItem>
                  {!user.banned && <MenuItem value="ban">Ban</MenuItem>}
                  {user.banned && <MenuItem value="unban">Unban</MenuItem>}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Users;
