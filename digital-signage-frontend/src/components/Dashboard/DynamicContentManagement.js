// src/components/Dashboard/DynamicContentManagement.js
import React from 'react';
import { Link } from 'react-router-dom';

const DynamicContentManagement = () => {
  return (
    <div>
      <h1>Manage Dynamic Content</h1>
      <ul>
        <li><Link to="/dynamic-content/weather">Weather Data</Link></li>
        <li><Link to="/dynamic-content/stocks">Stocks Data</Link></li>
        {/* Add more links for different types of dynamic content */}
      </ul>
    </div>
  );
};

export default DynamicContentManagement;
