const axios = require('axios');
const DynamicContent = require('../models/DynamicContent');

async function fetchAndStoreData() {
    const dynamicContents = await DynamicContent.find();
    dynamicContents.forEach(async (content) => {
        try {
            const response = await axios.get(content.apiUrl);
            content.data = response.data;
            content.lastFetched = Date.now();
            await content.save();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
}

// Fetch data every minute
setInterval(fetchAndStoreData, 60000);

module.exports = fetchAndStoreData;
