import React, {useEffect} from 'react'
import { IoClose } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { useImageFullpageStore } from '../store/ImageFullpageStore';

export const ImageFullpage = () => {
    const currentItem = useImageFullpageStore((state)=>state.currentItem)
    const setOpen = useImageFullpageStore((state)=>state.setOpen)
    
    const handleCloseFullpage = () => {
        setOpen(false); 
    }

    useEffect(() => {
        // Klavye olayını yakalayan fonksiyon
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleCloseFullpage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []); 
    

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
        <div className='image-fullpage-container'>
            <div className='image-fullpage-block'>
                <div className='image-fullpage-box'>
                    <img className='image-fullpage-image-item' src={currentItem.url} alt={"fullpage_"+currentItem.id}/>
                </div>
            </div>
            <IoClose className='image-fullpage-close' onClick={()=>{handleCloseFullpage()}}/>
            
            <div className='image-fullpage-download' onClick={handleDownload}>
                <MdOutlineFileDownload/>
                Download
            </div>
            
        </div>
    )
}
