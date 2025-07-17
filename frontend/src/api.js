import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://sumrise.onrender.com' : 'http://localhost:5000');

export const backendUrl = API_URL;
export const apiBaseUrl = `${API_URL}/api`;

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});