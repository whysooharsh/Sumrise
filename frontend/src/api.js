import axios from 'axios';
import { apiBaseUrl } from './config';

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});