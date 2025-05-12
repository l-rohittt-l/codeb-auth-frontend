import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (data) => {
  return axios.post(`${API_BASE_URL}/api/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_BASE_URL}/api/login`, data);
};
