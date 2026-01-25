import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 120000, // 2 minutes timeout for file uploads
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ielts_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  // For FormData, let axios set Content-Type automatically with boundary
  // Don't manually set Content-Type for FormData
  if (config.data instanceof FormData) {
    // Remove Content-Type header if it exists - axios will set it with boundary
    if (config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }
  }
  
  return config;
});

export default api;





