import { MdOutlineFileDownload } from "react-icons/md";



export const ImageDownloader = ({ image, className }) => {

    const handleDownload = async () => {
        try {
            // 1. Resmi fetch ile veriye (blob) çeviriyoruz
            const response = await fetch(image.url);
            const blob = await response.blob();

            // 2. Tarayıcının belleğinde geçici bir URL oluşturuyoruz
            const url = window.URL.createObjectURL(blob);

            // 3. Görünmez bir <a> elementi oluşturup tıklatıyoruz
            const link = document.createElement('a');
            link.href = url;
            
            // İndirilen dosyaya verilecek isim (örn: "manzara.jpg")
            link.download = image.id || 'indirilen-resim.jpg';
            
            document.body.appendChild(link);
            link.click();

            // 4. Temizlik yapıyoruz (Bellek yönetimi için önemli)
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        
        } catch (error) {
            console.error('Resim indirilirken hata oluştu:', error);
        }
    };

   

    return (<>
        <MdOutlineFileDownload className='download-icon' onClick={handleDownload}/>
        <img  src={image.url} alt={"image "+image.id}/>
    </>
    );
};
