// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const deviceRoutes = require('./routes/devices');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json());
app.use(cors());

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/content', require('./routes/content'));
app.use('/api/schedule', require('./routes/schedule'));

// Use the device routes
app.use('/api/devices', deviceRoutes);

// Define a simple route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Digital Signage CMS');
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
