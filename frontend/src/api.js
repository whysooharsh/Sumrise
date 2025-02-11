import axios from 'axios';
import { backendUrl } from './config';

const API_BASE_URL = backendUrl; // Update to your local backend URL

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
