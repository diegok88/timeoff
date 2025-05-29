import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.120.0.38:3000'
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);