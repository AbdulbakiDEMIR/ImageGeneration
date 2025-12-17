import { create } from 'zustand'
import axiosClient from '../api/axiosClient'
export const useChatUpdateFastPageStore = create((set,get) => ({
    updateFastPage: false,
    updateFastPageId: '',
    updateConfirm: false,

    setUpdateFastPage: (is) => {
        set({updateFastPage: is})
    },
    setUpdateFastPageId: (id) => {
        set({updateFastPageId: id})
    },
    setUpdateConfirm: (is) => {
        set({updateConfirm: is})
    },

    fetchUpdateChat: async (title) => {
        const id = get().updateFastPageId;
        try{
            const res = await axiosClient.put(`/chat/${id}`, {
                    title: title ? title : "New Chat",
                });
            set({updateFastPage: false, updateFastPageId: '', updateConfirm: false,})

        } catch (err) {
            console.log(err)
        }
    }
    
}))