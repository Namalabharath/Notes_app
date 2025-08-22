// API Configuration for Notes App
const API_CONFIG = {
  development: 'http://localhost:8000',
  production: 'https://notes-app-669e.onrender.com', // Your existing production URL
};

// Use Vite environment variable if available, otherwise detect environment
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 
  (process.env.NODE_ENV === 'production' ? API_CONFIG.production : API_CONFIG.development);

// API endpoints
export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: API_BASE_URL,
  
  // Notes endpoints
  NOTES: `${API_BASE_URL}/api/notes`,
  NOTES_BY_ID: (id) => `${API_BASE_URL}/api/notes/${id}`,
  
  // AI endpoints
  AI_GENERATE: `${API_BASE_URL}/api/ai/generate-notes`,
  AI_HEALTH: `${API_BASE_URL}/api/ai/health`,
  
  // Reminders endpoints
  REMINDERS: `${API_BASE_URL}/api/reminders`,
};

export default API_ENDPOINTS;
