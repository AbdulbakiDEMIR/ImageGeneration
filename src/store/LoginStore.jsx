import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosClient from '../api/axiosClient';

export const useLoginStore = create(
    persist(
        (set, get) => ({
            token: null,
            refreshToken: null,
            user: null,

            fetchLogin: async (username, password) => {
                try {
                    const response = await axiosClient.post('/auth/login', { email:username, password });
                    
                    // JSON yapına tam uygun eşleştirme:
                    const { token, refreshToken, user } = response.data;

                    // Eğer token gelmediyse hata fırlat
                    if (!token) {
                        throw new Error("Giriş başarılı ancak token alınamadı.");
                    }

                    // State'i güncelle
                    set({ 
                        token: token, 
                        refreshToken: refreshToken,
                        user: user 
                    });
                    
                    return true;
                } catch (error) {
                    console.error("Login Store Hatası:", error);
                    throw error;
                }
            },

            fetchRefreshToken: async () => {
                const { refreshToken } = get();
                if (!refreshToken) throw new Error("No refresh token");

                try {
                    const response = await axiosClient.post('/auth/refreshToken', { 
                        refreshToken: refreshToken 
                    });

                    // Backend'in refresh endpoint'inden dönen yapıya dikkat et.
                    // Muhtemelen orada da 'token' ismiyle dönüyordur.
                    const newToken = response.data.token || response.data.accessToken;
                    const newRefreshToken = response.data.refreshToken;

                    set({ 
                        token: newToken,
                        refreshToken: newRefreshToken || refreshToken 
                    });

                    return newToken;
                } catch (error) {
                    // Hata durumunda (refresh token süresi dolmuşsa) çıkış yap
                    get().logout();
                    throw error;
                }
            },

            fetchLogout: async () => {
                const { refreshToken } = get();
                // İsteğe bağlı: backend'e logout isteği gönderilebilir
                await axiosClient.post('/auth/logout',{
                    refreshToken
                }).catch(() => {}); 
                set({ token: null, refreshToken: null, user: null });
            }
        }),
        {
            name: 'auth-storage', // LocalStorage'da bu isimle görünecek
            storage: createJSONStorage(() => localStorage),
        }
    )
);