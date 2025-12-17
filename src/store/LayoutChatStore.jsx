import { create } from 'zustand'
import axiosClient from '../api/axiosClient';

export const useLayoutChatStore = create((set,get) => ({
    chats: [],
    

    fetchChats: async () => {
        try {
            const res = await axiosClient.get('/chat');
            const sortedData = res.data.sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
            set({ chats: sortedData})
        } catch (err) {
            console.log(err)
        }
    },

}))