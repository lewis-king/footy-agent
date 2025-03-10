// API configuration
const isDevelopment = import.meta.env?.DEV || process.env.NODE_ENV === 'development';

// Use environment variable in production, fallback to localhost in development
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5050/api' 
  : ((import.meta.env?.VITE_API_URL as string) || 'https://api.footyagent.ai/api');

export default {
  API_BASE_URL
};
