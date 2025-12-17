import { create } from 'zustand'


export const useLayoutStore = create((set) => ({
    isLayout: false,

    setLayout: (is) => {
       set({isLayout: is})
    },
}))