import { create } from 'zustand'


export const useImageFullpageStore = create((set,get) => ({
    currentItem: null,
    isOpen: false,

    setCurrent: (item) => {
        set({currentItem: item})
    },
    
    setOpen: (open) => {
        set({isOpen:open})
    }
    
}))