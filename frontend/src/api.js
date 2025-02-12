import axios from 'axios';
import { backendUrl } from './config';

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${backendUrl}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
