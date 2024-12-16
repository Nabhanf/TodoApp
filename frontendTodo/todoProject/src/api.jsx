import axios from 'axios';

const api = axios.create({
  baseURL: 'https://todoapp-zroc.onrender.com/api/', 
});

export default api;
