import React, { useEffect, useState } from 'react'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUserImagesStore } from '../../store/userImagesStore' 
import { ImageDownloader } from '../../components/ImageDownloader'
import { HiMiniMagnifyingGlassPlus } from "react-icons/hi2";
import { useImagePagginationStore } from '../../store/imagePagginationStore';
import { ImagePaggination } from '../../components/ImagePaggination';
import { MdOutlineDelete, MdOutlineSelectAll  } from "react-icons/md";
import { FastPage } from "../../components/FastPage"
import { useLayoutStore } from '../../store/LayoutStore';

import axiosClient from '../../api/axiosClient';

export const Images = () => {
    const images = useUserImagesStore((state)=>state.imageData)
    const fetchImage = useUserImagesStore((state)=>state.fetchImage)
    const [isDownloading, setIsDownloading] = useState(false);
    const [deletedList, setDeletedList] = useState([])
    const [deleteAnyConfirm,setDeleteAnyConfirm ] = useState(false)

    const setLayout = useLayoutStore((state)=>state.setLayout)
    setLayout(true)
    const pIsOpen = useImagePagginationStore((state)=>state.isOpen)
    const pSetImageData = useImagePagginationStore((state)=>state.setImageData)
    const pSetCurrent = useImagePagginationStore((state)=>state.setCurrent)
    const pSetOpen = useImagePagginationStore((state)=>state.setOpen)



    useEffect(() => {
        fetchImage()
    }, [fetchImage]) 

    useEffect(()=>{
        pSetImageData(images)
    },[images])



    const handleDeleteChange = (isChecked, itemId) => {
        if(isChecked) {
            setDeletedList(prev => [...prev, itemId])
        } else {
            setDeletedList(prev => prev.filter(item => item !== itemId))
        }
    }

    const handleBulkDownload = async () => {
        // 1. İndirilecek resimleri filtrele
        const selectedImages = images.filter(img => deletedList.includes(img.id));

        if (selectedImages.length === 0) {
            alert("Lütfen indirilecek resimleri seçin.");
            return;
        }

        setIsDownloading(true);
        const zip = new JSZip();

        try {
            // 2. Tüm resimleri paralel olarak fetch et ve zip'e ekle
            const downloadPromises = selectedImages.map(async (image) => {
                try {
                    // Resim verisini çek
                    const response = await fetch(image.url);
                    
                    // Eğer CORS hatası alırsan backend üzerinden proxy yapman gerekebilir
                    if (!response.ok) throw new Error("Network response was not ok");
                    
                    const blob = await response.blob();
                    
                    // Dosya adını belirle (Orijinal adını kullanıyoruz)
                    // Eğer id içinde uzantı yoksa manuel eklemen gerekebilir
                    const fileName = image.id.includes('.') ? image.id : `${image.id}.jpg`;

                    // Zip dosyasının içine ekle
                    zip.file(fileName, blob);
                } catch (err) {
                    console.error(`Hata - ${image.id} indirilemedi:`, err);
                }
            });

            // Tüm indirmelerin bitmesini bekle
            await Promise.all(downloadPromises);

            // 3. Zip dosyasını oluştur ve indir
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "secilen-resimler.zip");
            setDeletedList([])

        } catch (error) {
            console.error("Zip oluşturma hatası:", error);
            alert("Resimler paketlenirken bir hata oluştu.");
        } finally {
            setIsDownloading(false);
        }
    };
    const handlePaggination = (index) => {
        pSetCurrent(index);
        pSetOpen(true)
    }
    const handleSelectAll = () =>{
        if(deletedList.length === images.length) setDeletedList([])
        else  setDeletedList(images.map(item=>item.id))
    }

    const handleDeleteAnyImages = async () =>{
        try{
            const res = await axiosClient.delete(`/blob`, {
                // DELETE isteğinde body verisi "data" key'i içinde gönderilir
                data: {
                    all: deletedList.length === images.length,
                    imagesIds: deletedList.length === images.length? "":deletedList
                }
            });

            await fetchImage()
            setDeleteAnyConfirm(false)
            setDeletedList([])
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='app-router-container'>
            <div className='image-library-container'>
                {deletedList.length>0 && 
                    <div className='image-library-images-setting'>
                        <div>
                            {deletedList.length} seçildi
                        </div>
                        <div className='button delete' onClick={()=>setDeleteAnyConfirm(true)}> <MdOutlineDelete/> Sil </div>
                        <div onClick={()=>handleBulkDownload()} className='button download'> <HiMiniMagnifyingGlassPlus/> İndir </div>
                        <div onClick={()=>handleSelectAll()} className='button'> <MdOutlineSelectAll /> {deletedList.length === images.length ? "Seçimleri Kadır":"Hepsini Seç "}</div>
                    </div>
                }
                <div className='image-library-grid'>
                    {images.map((item, index) => {
                        const checked = deletedList.includes(item.id) 
                        return (
                            <div key={item.id} className='image-item'>
                                <label className={`image-item-checkbox-label ${checked?"checked":""}`} htmlFor={"delete_check_"+item.id} id={"delete_check_label_"+item.id}></label>
                                <input id={"delete_check_"+item.id} checked={checked} className="image-item-checkbox" type="checkbox" onChange={(e) => handleDeleteChange(e.target.checked, item.id)} />
                                <div className={"galery-image-item"}>
                                    <ImageDownloader image={item} />
                                    <HiMiniMagnifyingGlassPlus className='image-full-page-icon' onClick={()=>{handlePaggination(index)}}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {pIsOpen && 
                <ImagePaggination/>
            }
            {deleteAnyConfirm && 
                <FastPage title="Sil" close={()=>setDeleteAnyConfirm(false)} position='fixed'>
                    <div className='delete-chat-fast-page-text'>
                        <p>{deletedList.length} öğe silinecek. Emin misin?</p>
                    </div>
                    <div className='delete-galary-any-confirm'>
                        <button onClick={()=>setDeleteAnyConfirm(false)}>İptal</button>
                        <button onClick={()=>handleDeleteAnyImages()} className='delete'>Sil</button>
                    </div>
                </FastPage>
            }
        </div>
    )
}
