import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    // baseURL: 'https://cms-backend-5.onrender.com',
    timeout: 10000, // Thời gian chờ (ms)
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      // You might want to implement this based on your app's logic
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;