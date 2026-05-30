import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically inject JWT token and active portfolio slug into requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Retrieve active portfolio slug from localStorage (with 'shashwat' fallback)
  const activeSlug = localStorage.getItem('active_portfolio_slug') || 'shashwat';
  config.headers['x-portfolio-slug'] = activeSlug;

  return config;
});

export default api;
