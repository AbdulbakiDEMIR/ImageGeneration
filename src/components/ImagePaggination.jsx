import React, { useEffect } from 'react'
import { IoClose, IoChevronForward, IoChevronBack  } from "react-icons/io5";
import { useImagePagginationStore } from '../store/imagePagginationStore';
import { MdOutlineFileDownload } from "react-icons/md";

export const ImagePaggination = () => {
    const images = useImagePagginationStore((state)=>state.imageData)
    const currentIndex = useImagePagginationStore((state)=>state.currentIndex)
    const currentItem = useImagePagginationStore((state)=>state.currentItem)
    const setOpen = useImagePagginationStore((state)=>state.setOpen)
    const setCurrent = useImagePagginationStore((state)=>state.setCurrent)

    useEffect(() => {
        // Klavye olayını yakalayan fonksiyon
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleClosePaggination();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []); 
    
    const handleClosePaggination = () => {
        setOpen(false); 
    }

    const handleNextImage = ()=>{
        if(currentIndex === images.length - 1 ) setCurrent(0)
        else setCurrent(currentIndex + 1)
    }

    const handleBackImage = ()=>{
        if(currentIndex === 0 ) setCurrent(images.length - 1)
        else setCurrent(currentIndex - 1)
    }

    const handleDownload = async () => {

        try {
            // 1. Resmi fetch ile veriye (blob) çeviriyoruz
            const response = await fetch(currentItem.url);
            const blob = await response.blob();

            // 2. Tarayıcının belleğinde geçici bir URL oluşturuyoruz
            const url = window.URL.createObjectURL(blob);

            // 3. Görünmez bir <a> elementi oluşturup tıklatıyoruz
            const link = document.createElement('a');
            link.href = url;
            
            // İndirilen dosyaya verilecek isim (örn: "manzara.jpg")
            link.download = currentItem.id || 'indirilen-resim.jpg';
            
            document.body.appendChild(link);
            link.click();

            // 4. Temizlik yapıyoruz (Bellek yönetimi için önemli)
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        
        } catch (error) {
            console.error('Resim indirilirken hata oluştu:', error);
        }
    };

    return (
        <div className='image-paggination-container'>
            <div className='image-paggination-block'>
                <div className='paggination-move' onClick={()=>{handleBackImage()}}><IoChevronBack/></div>
                <div className='image-paggination-box'>
                    <img className='image-paggination-image-item' src={currentItem.url} alt={"paggination_"+currentItem.id}/>
                </div>
                <div className='paggination-move' onClick={()=>{handleNextImage()}}><IoChevronForward/></div>
            </div>
            <IoClose className='image-paggination-close' onClick={()=>{handleClosePaggination()}}/>
            
            <div className='image-paggination-download' onClick={handleDownload}>
                <MdOutlineFileDownload/>
                Download
            </div>
            
        </div>
    )
}
