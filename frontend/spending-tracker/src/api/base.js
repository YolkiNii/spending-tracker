import axios from 'axios';
const BASE_URL = 'http://localhost:3500';

const baseAPI = axios.create({
  baseURL: BASE_URL
});

export const privateBaseAPI = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

export default baseAPI;
