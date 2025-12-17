// src/api/axiosClient.js
import axios from 'axios';
import { useLoginStore } from '../store/LoginStore'; // Store'u import ediyoruz

const axiosClient = axios.create({
    baseURL: 'https://mongo-api-projem.vercel.app/api', // Backend URL'ini buraya yaz
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. REQUEST INTERCEPTOR (İstek gönderilmeden önce çalışır)
axiosClient.interceptors.request.use(
    (config) => {
        // Zustand store'dan güncel token'ı alıyoruz
        // getState() fonksiyonu hook kuralları dışında store'a erişmemizi sağlar
        const token = useLoginStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR (Cevap geldikten sonra çalışır)
axiosClient.interceptors.response.use(
    (response) => response, // Başarılıysa aynen dön
    async (error) => {
        const originalRequest = error.config;

        // Eğer hata 401 ise ve bu istek daha önce tekrarlanmamışsa (_retry kontrolü)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Store'daki refresh token alma fonksiyonunu çalıştır
                // Not: fetchRefreshToken içinden yeni access token dönecek
                const newAccessToken = await useLoginStore.getState().fetchRefreshToken();

                // Yeni token ile header'ı güncelle
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                // Orijinal isteği yeni token ile tekrarla
                return axiosClient(originalRequest);

            } catch (refreshError) {
                // Refresh token da geçersizse kullanıcıyı logout yap
                useLoginStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient; 