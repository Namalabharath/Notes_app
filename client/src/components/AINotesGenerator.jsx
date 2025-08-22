import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './AINotesGenerator.css';

const AINotesGenerator = () => {
  const [topic, setTopic] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const noteTypes = [
    { value: 'general', label: '📝 General Notes', desc: 'Comprehensive overview' },
    { value: 'study', label: '📚 Study Notes', desc: 'Structured for learning' },
    { value: 'summary', label: '📄 Summary', desc: 'Concise main points' },
    { value: 'detailed', label: '📖 Detailed Notes', desc: 'In-depth coverage' }
  ];

  const generateNotes = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    if (topic.trim().length < 2) {
      setError('Topic must be at least 2 characters long');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(API_ENDPOINTS.AI_GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          noteType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
        setTitle(data.suggestedTitle);
        setSuccess('Notes generated successfully! Review and edit if needed.');
      } else {
        setError(data.error || 'Failed to generate notes');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`Network error: ${error.message}. Please check if the server is running.`);
    }

    setIsGenerating(false);
  };

  const saveNotes = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!generatedContent.trim()) {
      setError('No content to save');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.NOTES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: generatedContent, // ← YOUR API USES 'description' FIELD
          isAIGenerated: true,
          aiMetadata: {
            originalTopic: topic,
            noteType,
            generatedAt: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess('Notes saved successfully! Redirecting to home...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Save error:', error);
      setError(`Failed to save notes: ${error.message}`);
    }

    setIsSaving(false);
  };

  const clearForm = () => {
    setTopic('');
    setNoteType('general'); // Reset to default
    setGeneratedContent('');
    setTitle('');
    setError('');
    setSuccess('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isGenerating && topic.trim()) {
      generateNotes();
    }
  };

  return (
    <div className="ai-notes-generator">
      <div className="container">
        <div className="header">
          <h1>🤖 AI Notes Generator</h1>
          <p>Generate comprehensive notes on any topic using Google Gemini AI</p>
        </div>

        <div className="input-section">
          <div className="form-group">
            <label htmlFor="topic">
              💡 What would you like notes about?
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Machine Learning, World War 2, React Hooks, Climate Change..."
              maxLength={200}
              disabled={isGenerating || isSaving}
            />
            <small className="char-count">{topic.length}/200 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="noteType">📋 Note Type</label>
            <select
              id="noteType"
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              disabled={isGenerating || isSaving}
            >
              {noteTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <small className="note-desc">
              Selected: {noteTypes.find(t => t.value === noteType)?.label} - {noteTypes.find(t => t.value === noteType)?.desc}
            </small>
          </div>

          <div className="button-group">
            <button
              onClick={generateNotes}
              disabled={isGenerating || isSaving || !topic.trim() || topic.trim().length < 2}
              className="generate-btn"
            >
              {isGenerating ? '⏳ Generating...' : '✨ Generate Notes'}
            </button>
            
            {generatedContent && (
              <button
                onClick={clearForm}
                disabled={isGenerating || isSaving}
                className="clear-btn"
              >
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="message error-message">
            <span className="icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="message success-message">
            <span className="icon">✅</span>
            <span>{success}</span>
          </div>
        )}

        {generatedContent && (
          <div className="generated-section">
            <div className="section-header">
              <h3>📄 Generated Notes Preview</h3>
              <div className="badges">
                <span className="badge">{noteType}</span>
                <span className="badge ai-badge">AI Generated</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="title">📝 Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your note..."
                maxLength={100}
                disabled={isSaving}
              />
              <small className="char-count">{title.length}/100 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="content">📖 Content</label>
              <textarea
                id="content"
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={20}
                placeholder="Generated content will appear here..."
                disabled={isSaving}
              />
              <small className="char-count">{generatedContent.length} characters</small>
            </div>

            <div className="final-actions">
              <button
                onClick={generateNotes}
                disabled={isGenerating || isSaving}
                className="regenerate-btn"
              >
                🔄 Regenerate
              </button>
              <button
                onClick={saveNotes}
                disabled={isSaving || isGenerating || !title.trim()}
                className="save-btn"
              >
                {isSaving ? '💾 Saving...' : '💾 Save Notes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AINotesGenerator;