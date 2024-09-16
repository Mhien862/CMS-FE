import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Thay đổi URL này theo backend của bạn
    timeout: 10000, // Thời gian chờ (ms)
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer${token}`; // Thêm token vào header
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

export default axiosInstance;