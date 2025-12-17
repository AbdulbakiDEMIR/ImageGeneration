import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';
import { upload } from '@vercel/blob/client';
import { useLoginStore } from './LoginStore';

const BLOB_API_URL = "https://mongo-api-projem.vercel.app/api/blob";

export const useImageStore = create((set) => ({
    // Başlangıç değeri boş bir dizi
    imageData: [],


    saveBlobImage: async (images= []) => {
        const token = useLoginStore.getState().token;
        const imagesUploadPromises = images.map(async (img) => {
            return await upload(img.id, img.file, { 
                access: 'public',
                handleUploadUrl: BLOB_API_URL,
                clientPayload: JSON.stringify({
                    token: token, 
                    imageId: img.id,
                })
            });
        });

        return await Promise.all(imagesUploadPromises);
    },

    // İsimlendirmeyi 'addImage' olarak değiştirdik (Listeye ekleme yapıldığı için)
    addImage: (imageInput) => {
        // 1. Validasyon: URL veya File yoksa işlem yapma ve fonksiyonu durdur.
        if (!imageInput.url && !imageInput.file) {
            console.error("Hata: URL veya dosya eksik!");
            return; // Hatalıysa devam etme
        }

        // 2. ID Kontrolü ve Hazırlık:
        // Gelen objeyi mutasyona uğratmak yerine yeni bir obje oluşturuyoruz (Best Practice)
        const newImageItem = {
            ...imageInput,
            id: imageInput.id || uuidv4() // ID varsa kullan, yoksa oluştur
        };

        // 3. State Güncelleme (Array'e Ekleme):
        set((state) => ({
            // Eski listeyi kopyala (...state.imageData) ve sonuna yenisini ekle
            imageData: [...state.imageData, newImageItem]
        }));
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