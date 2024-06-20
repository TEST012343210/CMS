// src/components/Dashboard/ManageContent.js
import React, { useEffect, useState } from 'react';
import { getAllContent } from '../../services/contentService';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const ManageContent = ({ token }) => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getAllContent(token);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content', error.response.data);
      }
    };

    fetchContent();
  }, [token]);

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Content
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell><a href={item.url}>{item.url}</a></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ManageContent;
