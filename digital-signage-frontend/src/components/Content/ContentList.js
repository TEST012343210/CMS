// src/components/Content/ContentList.js
import React, { useEffect, useState } from 'react';
import { getAllContent } from '../../services/contentService';

const ContentList = ({ token }) => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getAllContent(token);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content', error.response?.data || error.message);
      }
    };

    fetchContent();
  }, [token]);

  return (
    <div>
      <h2>Content List</h2>
      <ul>
        {content.map((item) => (
          <li key={item._id}>
            {item.title} - {item.type} - <a href={item.url}>{item.url}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentList;
