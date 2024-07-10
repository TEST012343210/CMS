require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const startScheduler = require('./scheduler');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Set security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"]
    }
  }
}));

// Serve static files from the uploads directory with CORS headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/content', require('./routes/content'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/dynamic-content', require('./routes/dynamicContent'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/ai-content', require('./routes/aiContentRoute')); // Add AI Content Route

const Device = require('./models/Device');

// Endpoint to register device
app.post('/api/registerDevice', async (req, res) => {
  console.log(req.body);  // Log the incoming request

  const { clientId, name, identifier, approved, code, locationId, brand, model, capacity, firmwareVersion, macAddress, ipAddress } = req.body;

  try {
    const device = new Device({
      clientId,
      name,
      identifier,
      approved,
      code,
      locationId,
      brand,
      model,
      capacity,
      firmwareVersion,
      macAddress,
      ipAddress
    });

    await device.save();
    res.status(200).send({ message: 'Device registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to register device', error });
  }
});

// Endpoint to get all devices
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).send(devices);
  } catch (error) {
    res.status(500).send({ message: 'Failed to retrieve devices', error });
  }
});

// Define a simple route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Digital Signage CMS');
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Start the scheduler
startScheduler();
