import React, { useRef, useEffect } from 'react'
import { ImageDownloader } from '../../../components/ImageDownloader';
import { HiMiniMagnifyingGlassPlus } from "react-icons/hi2";
import { useImageFullpageStore } from "../../../store/ImageFullpageStore";

export const ChatDialogs = ({dialogs, height, loading}) => {
    const lastMessageRef = useRef(null);
    const loadingRef = useRef(null);

    const IF_setOpen = useImageFullpageStore((state) => state.setOpen);
    const IF_setCurrent = useImageFullpageStore((state) => state.setCurrent);
    
    useEffect(() => {
        // Eğer ref bir elemente bağlandıysa (yani son mesaj AI ise)
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' // 'start': Elemanın üstü ekranın üstüne hizalanır
            });
        }
    }, [dialogs]);
    useEffect(() => {
        // Eğer ref bir elemente bağlandıysa (yani son mesaj AI ise)
        if (loadingRef.current) {
            loadingRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' // 'start': Elemanın üstü ekranın üstüne hizalanır
            });
        }
    }, [loading]);

     const handleFullpage = (item) =>{
        IF_setCurrent(item)
        IF_setOpen(true)
    }

    return (
        <div className="dialog-container"  style={{"--dialog-container-height": `${height + 40}px`, marginBottom: `${height + 40}px`}}>
            {dialogs.map((dialog, index)=>{
                const role = dialog.role;
                return(
                    <div ref={lastMessageRef} key={index} className="message-container">
                        <div className={`message-box ${role}`}>
                            {dialog.images?.length > 0 && (
                                <div className='message-images'>
                                    {dialog.images.map((image)=>{
                                        return(
                                                <div key={image.id}  className={"message-image-item"}>
                                                    <HiMiniMagnifyingGlassPlus className="fullpage-icon" onClick={()=>handleFullpage(image)}/>
                                                    <ImageDownloader image={image} />
                                                </div>  
                                        )
                                    })}
                                </div>
                            )}

                            {dialog.content}
                        </div>
                    </div>
                )
            })}
            {loading && (
                <div ref={loadingRef} className='loading-container' style={{"--dialog-container-height": `${height + 40}px`}} >
                    <div className="loader">
                    </div>
                </div>
            )}
        </div>
    )
}


