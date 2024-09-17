const cron = require('node-cron');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const Content = require('./models/Content');

const db = process.env.MONGO_URI; // Use environment variable for MongoDB URI
const updateIntervalMinutes = process.env.UPDATE_INTERVAL_MINUTES || 60; // Default to 60 minutes if not set

mongoose.connect(db)
  .then(() => {
    console.log('MongoDB connected for scheduler');
  })
  .catch((err) => {
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

      console.log(`Checking content: ${content.title}, last fetched: ${content.lastFetched}, minutes since last fetch: ${minutesSinceLastFetch}`);

      if (minutesSinceLastFetch >= content.updateInterval) {
        console.log(`Updating content: ${content.title} with interval ${content.updateInterval} minutes.`);
        try {
          const response = await axios.get(content.apiUrl);
          content.data = response.data;
          content.lastFetched = now;

          // Force Mongoose to recognize changes
          content.markModified('data');
          content.markModified('lastFetched');

          await content.save();
          console.log(`Successfully updated content for ${content.title}`);
          
        } catch (err) {
          console.error(`Error fetching data for ${content.title}:`, err.message);
        }
      } else {
        console.log(`No update needed for ${content.title} (Interval: ${content.updateInterval}, Minutes since last fetch: ${minutesSinceLastFetch})`);
      }
    }
  } catch (err) {
    console.error('Error updating dynamic content:', err.message);
  }
};

// Schedule the update task to run every X minutes based on the environment variable
cron.schedule(`*/${updateIntervalMinutes} * * * *`, updateDynamicContent);

console.log(`Scheduler started, updating dynamic content every ${updateIntervalMinutes} minutes.`);

module.exports = updateDynamicContent;
