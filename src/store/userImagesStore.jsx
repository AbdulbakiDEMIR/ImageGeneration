import { create } from 'zustand'
import axiosClient from '../api/axiosClient.js';

export const useUserImagesStore = create((set) => ({
    imageData: [],

    fetchImage: async () => {
        try{
            const res = await axiosClient.get(`/blob`);
            set({ imageData: res.data})
        } catch (err) {
            console.log(err)
        }

    },
    
    // Opsiyonel: Resmi silmek istersen buna ihtiyacın olacak
    removeImage: (id) => set((state) => ({
        imageData: state.imageData.filter((img) => img.id !== id)
    })),

    // Tüm resimleri sil
    removeAllImage: () => set((state) => ({
        imageData: []
    })) 
}))