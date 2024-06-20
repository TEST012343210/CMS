// src/components/Content/ContentForm.js
import React, { useState } from 'react';
import { createContent } from '../../services/contentService';

const ContentForm = ({ token }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createContent(title, type, url, token);
      console.log('Content created', response.data);
      // Clear the form
      setTitle('');
      setType('image');
      setUrl('');
    } catch (error) {
      console.error('Error creating content', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Create Content</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="webpage">Webpage</option>
            <option value="interactive">Interactive</option>
          </select>
        </div>
        <div>
          <label>URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Content</button>
      </form>
    </div>
  );
};

export default ContentForm;
