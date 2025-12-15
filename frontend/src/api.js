import axios from 'axios';

// API Base URL (Gelecekte .env'den çekilebilir)
const API_BASE_URL = 'http://127.0.0.1:8001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Her isteğe Token ekle)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (401 Gelirse Çıkış Yap)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token geçersiz veya süresi dolmuş
            console.warn("401 Unauthorized - Otomatik çıkış yapılıyor.");

            // Eğer zaten login sayfasındaysak döngüye girmesin
            if (window.location.pathname !== '/login') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
