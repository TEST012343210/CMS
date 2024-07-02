// src/components/DynamicData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './DynamicData.css'; // Import the CSS file

const DynamicData = () => {
  const { type } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/dynamic-data/${type}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dynamic data:', error);
      }
    };

    fetchData();
  }, [type]);

  return (
    <div className="dynamic-data-container">
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Data</h1>
      {data ? (
        <pre className="data-content">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default DynamicData;
