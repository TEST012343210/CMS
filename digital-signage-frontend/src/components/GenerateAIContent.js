import React, { useState } from 'react';
import axios from 'axios';

const GenerateAIContent = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:3000/api/ai-content/generate-content', { prompt });
      setGeneratedContent(response.data.content);
    } catch (error) {
      console.error('Error generating content:', error.message, error.response ? error.response.data : '');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContent = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/content/save-generated', { content: generatedContent });
      onSave(generatedContent);
    } catch (error) {
      console.error('Error saving content:', error.message, error.response ? error.response.data : '');
    }
  };

  return (
    <div>
      <h1>Generate AI Content</h1>
      <textarea 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt here"
      />
      <button onClick={handleGenerateContent} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
      <div>
        <h2>Generated Content</h2>
        <p>{generatedContent}</p>
      </div>
      {generatedContent && (
        <div>
          <button onClick={handleGenerateContent} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Again'}
          </button>
          <button onClick={handleSaveContent}>Save</button>
        </div>
      )}
    </div>
  );
};

export default GenerateAIContent;
