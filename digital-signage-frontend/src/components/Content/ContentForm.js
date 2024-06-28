import React, { useState } from 'react';
import { createContent } from '../../services/contentService';

const ContentForm = ({ token }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [uploadType, setUploadType] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [ssspUrl, setSsspUrl] = useState('');
  const [ftpDetails, setFtpDetails] = useState({ host: '', path: '', username: '', password: '' });
  const [cifsDetails, setCifsDetails] = useState({ host: '', path: '', username: '', password: '' });
  const [streamingUrl, setStreamingUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);

    switch (type) {
      case 'webpage':
        formData.append('url', url);
        break;
      case 'sssp_web_app':
        formData.append('ssspUrl', ssspUrl);
        break;
      case 'ftp':
        formData.append('ftpDetails', JSON.stringify(ftpDetails));
        break;
      case 'cifs':
        formData.append('cifsDetails', JSON.stringify(cifsDetails));
        break;
      case 'streaming':
        formData.append('streamingUrl', streamingUrl);
        break;
      default:
        if (uploadType === 'url') {
          formData.append('url', url);
        } else if (file) {
          formData.append('file', file);
        } else {
          console.error('No URL or file provided');
          return;
        }
    }

    try {
      const content = await createContent(formData, token);
      console.log('Content created', content);
      // Clear the form
      setTitle('');
      setType('image');
      setUploadType('url');
      setUrl('');
      setFile(null);
      setSsspUrl('');
      setFtpDetails({ host: '', path: '', username: '', password: '' });
      setCifsDetails({ host: '', path: '', username: '', password: '' });
      setStreamingUrl('');
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
            <option value="sssp_web_app">SSSP Web App</option>
            <option value="ftp">FTP</option>
            <option value="cifs">CIFS</option>
            <option value="streaming">Streaming</option>
          </select>
        </div>
        {['image', 'video', 'interactive'].includes(type) && (
          <div>
            <label>Upload Type</label>
            <select value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
              <option value="url">URL</option>
              <option value="file">Upload File</option>
            </select>
          </div>
        )}
        {type === 'webpage' && (
          <div>
            <label>URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        )}
        {type === 'sssp_web_app' && (
          <div>
            <label>SSSP Web App URL</label>
            <input
              type="url"
              value={ssspUrl}
              onChange={(e) => setSsspUrl(e.target.value)}
              required
            />
          </div>
        )}
        {type === 'ftp' && (
          <div>
            <label>FTP Details</label>
            <input
              type="text"
              placeholder="Host"
              value={ftpDetails.host}
              onChange={(e) => setFtpDetails({ ...ftpDetails, host: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Path"
              value={ftpDetails.path}
              onChange={(e) => setFtpDetails({ ...ftpDetails, path: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={ftpDetails.username}
              onChange={(e) => setFtpDetails({ ...ftpDetails, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={ftpDetails.password}
              onChange={(e) => setFtpDetails({ ...ftpDetails, password: e.target.value })}
              required
            />
          </div>
        )}
        {type === 'cifs' && (
          <div>
            <label>CIFS Details</label>
            <input
              type="text"
              placeholder="Host"
              value={cifsDetails.host}
              onChange={(e) => setCifsDetails({ ...cifsDetails, host: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Path"
              value={cifsDetails.path}
              onChange={(e) => setCifsDetails({ ...cifsDetails, path: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={cifsDetails.username}
              onChange={(e) => setCifsDetails({ ...cifsDetails, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={cifsDetails.password}
              onChange={(e) => setCifsDetails({ ...cifsDetails, password: e.target.value })}
              required
            />
          </div>
        )}
        {type === 'streaming' && (
          <div>
            <label>Streaming URL</label>
            <input
              type="url"
              value={streamingUrl}
              onChange={(e) => setStreamingUrl(e.target.value)}
              required
            />
          </div>
        )}
        {uploadType === 'url' && ['image', 'video', 'interactive'].includes(type) && (
          <div>
            <label>URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required={uploadType === 'url'}
            />
          </div>
        )}
        {uploadType === 'file' && ['image', 'video', 'interactive'].includes(type) && (
          <div>
            <label>File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required={uploadType === 'file'}
            />
          </div>
        )}
        <button type="submit">Create Content</button>
      </form>
    </div>
  );
};

export default ContentForm;
