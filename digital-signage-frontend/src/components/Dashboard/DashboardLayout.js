// src/components/Dashboard/DashboardLayout.js
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Collapse, ListItemIcon } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';

const drawerWidth = 240;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openContentMenu, setOpenContentMenu] = useState(false);
  const [openDevicesMenu, setOpenDevicesMenu] = useState(false);
  const [role, setRole] = useState('');
  const [headerTitle, setHeaderTitle] = useState('Dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    switch (path) {
      case 'users':
        setHeaderTitle('Users');
        break;
      case 'content':
      case 'create-content':
        setHeaderTitle('Content');
        break;
      case 'schedules':
        setHeaderTitle('Schedules');
        break;
      case 'devices':
      case 'all-devices':
      case 'unapproved-devices':
        setHeaderTitle('Devices');
        break;
      default:
        setHeaderTitle('Dashboard');
    }
  }, [location]);

  const handleContentClick = () => {
    setOpenContentMenu(!openContentMenu);
  };

  const handleDevicesClick = () => {
    setOpenDevicesMenu(!openDevicesMenu);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" style={{ zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            {headerTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        style={{ width: drawerWidth, flexShrink: 0 }}
        PaperProps={{ style: { width: drawerWidth } }}
      >
        <Toolbar />
        <div style={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleDevicesClick}>
              <ListItemIcon>
                <DevicesIcon />
              </ListItemIcon>
              <ListItemText primary="Devices" />
              {openDevicesMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openDevicesMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/dashboard/all-devices">
                  <ListItemText primary="All Devices" />
                </ListItem>
                <ListItem button component={Link} to="/dashboard/unapproved-devices">
                  <ListItemText primary="Unapproved Devices" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={handleContentClick}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Content" />
              {openContentMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openContentMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/dashboard/content">
                  <ListItemText primary="Manage Content" />
                </ListItem>
                <ListItem button component={Link} to="/dashboard/create-content">
                  <ListItemText primary="Create Content" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button component={Link} to="/dashboard/schedules">
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary="Schedules" />
            </ListItem>
            {role === 'Admin' && (
              <ListItem button component={Link} to="/dashboard/users">
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItem>
            )}
            <ListItem button onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '24px', marginLeft: drawerWidth }}>
        <Toolbar />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
