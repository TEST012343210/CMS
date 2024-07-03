import React, { useEffect, useState } from 'react';
import { getAllContent, deleteContent, getDynamicContent } from '../../services/contentService';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Checkbox, Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  media: {
    width: 100,
    height: 50,
    objectFit: 'cover',
    cursor: 'pointer',
  },
  previewColumn: {
    width: 120,
  },
  separator: {
    borderRight: '1px solid #e0e0e0',
  },
  checkboxColumn: {
    display: 'flex',
    alignItems: 'center',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '1rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'auto',
  },
  closeButton: {
    position: 'absolute !important',
    top: '10px',
    right: '10px',
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  dynamicContent: {
    whiteSpace: 'pre-wrap',
  },
  weatherInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& img': {
      width: 64,
      height: 64,
    },
  },
});

const ManageContent = ({ token }) => {
  const classes = useStyles();
  const [content, setContent] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getAllContent(token);
        setContent(response);
      } catch (error) {
        console.error('Error fetching content', error.response?.data || error.message);
      }
    };

    fetchContent();
  }, [token]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = content.map((item) => item._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteContent(selected, token);
      setContent(content.filter((item) => !selected.includes(item._id)));
      setSelected([]);
    } catch (error) {
      console.error('Error deleting content', error.response?.data || error.message);
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleImageClick = async (content) => {
    if (content.type === 'dynamic') {
      try {
        const response = await getDynamicContent(content._id, token);
        setSelectedContent({ ...content, dynamicData: response.data });
      } catch (error) {
        console.error('Error fetching dynamic content', error.response?.data || error.message);
      }
    } else {
      setSelectedContent(content);
    }
  };

  const handleCloseModal = () => {
    setSelectedContent(null);
  };

  const renderPreview = (item) => {
    if (item.type === 'dynamic') {
      return (
        <img
          src="/dynamic-content-default-preview.jpg"
          alt="Dynamic Content"
          className={classes.media}
          onClick={() => handleImageClick(item)}
          onError={(e) => e.target.style.display = 'none'}
        />
      );
    }

    return item.type === 'video' ? (
      <video
        className={classes.media}
        controls
        onClick={() => handleImageClick(item)}
      >
        <source src={item.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <img
        src={item.previewImageUrl || item.file || item.url || ''}
        alt={item.title}
        className={classes.media}
        onClick={() => handleImageClick(item)}
        onError={(e) => e.target.style.display = 'none'}
      />
    );
  };

  const renderDynamicContent = (data) => {
    if (!data || !data.location || !data.current) return null;

    return (
      <div className={classes.weatherInfo}>
        <Typography variant="h6">Weather in {data.location.name}</Typography>
        <Typography variant="body1">{data.current.condition.text}</Typography>
        <img src={`http:${data.current.condition.icon}`} alt={data.current.condition.text} />
        <Typography variant="body1">Temperature: {data.current.temp_c}°C</Typography>
        <Typography variant="body1">Wind: {data.current.wind_kph} kph {data.current.wind_dir}</Typography>
        <Typography variant="body1">Humidity: {data.current.humidity}%</Typography>
      </div>
    );
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Manage Content
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleDeleteSelected} disabled={selected.length === 0}>
        Delete Selected
      </Button>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" className={classes.checkboxColumn}>
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < content.length}
                checked={content.length > 0 && selected.length === content.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all contents' }}
              />
              Check All
            </TableCell>
            <TableCell className={classes.separator}>Preview</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map((item) => {
            const isItemSelected = isSelected(item._id);
            return (
              <TableRow key={item._id} selected={isItemSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    onChange={() => handleCheckboxClick(item._id)}
                    inputProps={{ 'aria-labelledby': `content-checkbox-${item._id}` }}
                  />
                </TableCell>
                <TableCell className={classes.previewColumn}>
                  {renderPreview(item)}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <a href={item.file || item.url} target="_blank" rel="noopener noreferrer">
                    {item.file || item.url}
                  </a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Modal open={!!selectedContent} onClose={handleCloseModal} className={classes.modal}>
        <Box className={classes.modalContent}>
          <IconButton className={classes.closeButton} onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
          {selectedContent?.type === 'dynamic' ? (
            renderDynamicContent(selectedContent.dynamicData)
          ) : selectedContent?.type === 'video' ? (
            <video className={classes.modalImage} controls>
              <source src={selectedContent.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={selectedContent?.previewImageUrl || selectedContent?.file || selectedContent?.url || ''} alt="Preview" className={classes.modalImage} />
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default ManageContent;
