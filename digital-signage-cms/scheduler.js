// backend/scheduler.js

const cron = require('node-cron');
const axios = require('axios');
const mongoose = require('mongoose');
const config = require('config');
const Content = require('./models/Content');

const db = config.get('mongoURI'); // Use config to get the MongoDB URI
const updateIntervalMinutes = config.get('updateIntervalMinutes'); // Get update interval from config

mongoose.connect(db, {
  // Removed deprecated options
}).then(() => {
  console.log('MongoDB connected for scheduler');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

// Function to update dynamic content
const updateDynamicContent = async () => {
  try {
    const now = new Date();
    const contents = await Content.find({ type: 'dynamic' });

    for (const content of contents) {
      const lastFetched = new Date(content.lastFetched);
      const minutesSinceLastFetch = (now - lastFetched) / (1000 * 60);

      if (minutesSinceLastFetch >= content.updateInterval) {
        try {
          const response = await axios.get(content.apiUrl);
          content.data = response.data;
          content.lastFetched = now;
          await content.save();
          console.log(`Updated content for ${content.title}`);
        } catch (err) {
          console.error(`Error fetching data for ${content.title}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error('Error updating dynamic content:', err.message);
  }
};

// Schedule the update task to run every X minutes based on the config
cron.schedule(`*/${updateIntervalMinutes} * * * *`, updateDynamicContent);

console.log(`Scheduler started, updating dynamic content every ${updateIntervalMinutes} minutes.`);

module.exports = updateDynamicContent;
