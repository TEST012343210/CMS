import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Collapse, ListItemIcon, Box } from '@mui/material';
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
  const [openSchedulesMenu, setOpenSchedulesMenu] = useState(false);
  const [role, setRole] = useState('');
  const [headerTitle, setHeaderTitle] = useState('Dashboard');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
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
      case 'upload-content':
      case 'manage-content':
        setHeaderTitle('Content');
        break;
      case 'create-schedule':
      case 'manage-schedules':
        setHeaderTitle('Schedules');
        break;
      case 'devices':
      case 'all-devices':
      case 'unapproved-devices':
        setHeaderTitle('Devices');
        break;
      case 'manage-dynamic-content':
        setHeaderTitle('Manage Dynamic Content');
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

  const handleSchedulesClick = () => {
    setOpenSchedulesMenu(!openSchedulesMenu);
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {headerTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
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
                  <ListItemText primary="All Devices" sx={{ pl: 4 }} />
                </ListItem>
                <ListItem button component={Link} to="/dashboard/unapproved-devices">
                  <ListItemText primary="Unapproved Devices" sx={{ pl: 4 }} />
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
                <ListItem button component={Link} to="/dashboard/upload-content">
                  <ListItemText primary="Upload Content" sx={{ pl: 4 }} />
                </ListItem>
                <ListItem button component={Link} to="/dashboard/manage-content">
                  <ListItemText primary="Manage Content" sx={{ pl: 4 }} />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={handleSchedulesClick}>
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary="Schedules" />
              {openSchedulesMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openSchedulesMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/dashboard/create-schedule">
                  <ListItemText primary="Create Schedule" sx={{ pl: 4 }} />
                </ListItem>
                <ListItem button component={Link} to="/dashboard/manage-schedules">
                  <ListItemText primary="Manage Schedules" sx={{ pl: 4 }} />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button component={Link} to="/dashboard/manage-dynamic-content">
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Dynamic Content" />
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
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
