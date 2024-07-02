const express = require('express');
const router = express.Router();
const axios = require('axios');
const DynamicContent = require('../models/DynamicContent'); // Ensure you have the model created
require('dotenv').config(); // Load environment variables

// Route to fetch dynamic data based on type
router.get('/:type', async (req, res) => {
  const { type } = req.params;
  let url;

  switch (type) {
    case 'weather':
      const city = req.query.city || 'London'; // You can change the default city
      url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`;
      break;
    // Remove or comment out the stocks case if not needed
    // case 'stocks':
    //   url = `https://api.example.com/stocks?apikey=${process.env.STOCKS_API_KEY}`;
    //   break;
    // Add more cases for different types if needed
    default:
      return res.status(400).json({ error: 'Invalid data type' });
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch all dynamic content
router.get('/', async (req, res) => {
  try {
    const dynamicContent = await DynamicContent.find();
    res.json(dynamicContent);
  } catch (error) {
    console.error('Error fetching dynamic content:', error);
    res.status(500).json({ error: 'Error fetching dynamic content' });
  }
});

// Route to add new dynamic content
router.post('/', async (req, res) => {
  const { contentType, apiUrl, updateInterval } = req.body;

  try {
    const newDynamicContent = new DynamicContent({
      contentType,
      apiUrl,
      updateInterval
    });

    const savedDynamicContent = await newDynamicContent.save();
    res.json(savedDynamicContent);
  } catch (error) {
    console.error('Error adding dynamic content:', error);
    res.status(500).json({ error: 'Error adding dynamic content' });
  }
});

// Route to update dynamic content
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { contentType, apiUrl, updateInterval } = req.body;

  try {
    const updatedDynamicContent = await DynamicContent.findByIdAndUpdate(
      id,
      { contentType, apiUrl, updateInterval },
      { new: true }
    );

    res.json(updatedDynamicContent);
  } catch (error) {
    console.error('Error updating dynamic content:', error);
    res.status(500).json({ error: 'Error updating dynamic content' });
  }
});

// Route to delete dynamic content
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await DynamicContent.findByIdAndDelete(id);
    res.json({ message: 'Dynamic content deleted' });
  } catch (error) {
    console.error('Error deleting dynamic content:', error);
    res.status(500).json({ error: 'Error deleting dynamic content' });
  }
});

module.exports = router;
