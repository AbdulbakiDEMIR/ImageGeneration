import { create } from 'zustand'


export const useImagePagginationStore = create((set,get) => ({

    imageData: [],
    currentIndex: null,
    currentItem: null,
    isOpen: false,


    
    setImageData: (images) => {
       set({imageData: images})
    },
    
    setCurrent: (index) => {
        const images = get().imageData;
        if(images[index]){set({currentIndex:index, currentItem: images[index]})}
    },
    
    setOpen: (open) => {
        set({isOpen:open})
    }
    
}))