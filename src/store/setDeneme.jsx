import { create } from 'zustand'


export const useData = create((set) => ({

    data: [],

    
    setData: (userData) => {
       set({data: userData})
    },
    
    
}))