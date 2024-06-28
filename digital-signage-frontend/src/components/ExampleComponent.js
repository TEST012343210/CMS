// src/components/ExampleComponent.js
import React from 'react';

const ExampleComponent = () => {
  const navigateToDeviceRegistration = () => {
    const token = localStorage.getItem('authToken');
    const url = `http://localhost:3002?token=${token}`;
    window.location.href = url;
  };

  return (
    <button onClick={navigateToDeviceRegistration}>Register Device</button>
  );
};

export default ExampleComponent;
