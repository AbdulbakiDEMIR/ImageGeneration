import { create } from 'zustand'
import axiosClient from '../api/axiosClient'
export const useChatDeleteFastPageStore = create((set,get) => ({
    deleteFastPage: false,
    deleteFastPageId: '',


    setDeleteFastPage: (is) => {
        set({deleteFastPage: is})
    },
    setDeleteFastPageId: (id) => {
        set({deleteFastPageId: id})
    },

    setDeleteChat: async () => {
        const id = get().deleteFastPageId;
        try{
            const res = await axiosClient.delete(`/chat/${id}`);
            set({deleteFastPage: false, deleteFastPageId: ''})

        } catch (err) {
            console.log(err)
        }
    }
    
}))