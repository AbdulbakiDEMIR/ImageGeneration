import { create } from 'zustand'
import axiosClient from '../api/axiosClient';

export const useChatStore = create((set,get) => ({
    dialogs: [],
    chatId: null,
    chatTitle: null,
    firstMessage: true,
    chatWait: false,

    fetchChats: async (id) => {
        if(id){
            try{
                const res = await axiosClient.get(`/chat/${id}`);
                set({ dialogs: res.data.messages, chatId: id, firstMessage: false })
            } catch (err) {
                console.log(err)
            }
        }
    },

    fetchCreateChat: async () => {
        const currentFirstMessage = get().firstMessage;
        const title = get().chatTitle;
        if(currentFirstMessage){
            try{
                const res = await axiosClient.post('/chat', {
                    title: title ? title : "New Chat",
                    model: "gemini-2.5-flash-image",
                })
                set({chatId: res.data.chatId, firstMessage: false})
            }catch(err){

            }   
        }
    },

    addMessge: (message) => {
        set((state) => ({ dialogs: [...state.dialogs, message]}));
    },
    
    restartChat: () => {
        set({ dialogs: [], chatId: null, firstMessage: true })
    },

    setChatWait: (is) => {
        set({chatWait: is})
    },

    setChatTitle: (title) => {
        set({chatTitle: title})
    }
}))