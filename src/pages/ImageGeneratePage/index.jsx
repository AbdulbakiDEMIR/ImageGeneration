import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GeminiInput } from './layouts/GeminiInput';
import { ImageUploader } from './layouts/ImageUploader';
import { generateImage } from '../../services/imagenService';
import { ChatDialogs } from './layouts/ChatDialogs';

const bekle = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const ImageGeneratePage = () => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [inputHeight, setInputHeight] = useState(0); 
    const [images, setImages] = useState([]);
    const [dialogs, setDialogs] = useState([])
    const [loading, setLoading] = useState(false)
    

    // previewUrl değiştiğinde images listesine ekle
    useEffect(() => {
        if (previewUrl) {
            setImages(prev => {
                const isExists = prev?.some(img => img.url === previewUrl);
                if (isExists) {
                    return prev; // Değişiklik yapma
                }
                return [
                        ...prev,
                        {
                            id: uuidv4(),
                            url: previewUrl.url,
                            file: previewUrl.file
                        }
                    ];
            })
        }
    }, [previewUrl]);

    // Gönderim sonrası hem listeyi hem de son seçilen url'i temizleyen fonksiyon
    const handleReset = () => {
        setImages([]);
        setPreviewUrl(null);
    };



    const handleGenerate = async (prompt) => {
        const tempImages = structuredClone(images)
        setDialogs(prev=>[...prev, 
            {
                id:uuidv4(),
                role: "user",
                message: {
                    text: prompt,
                    images: tempImages
                }
            }
        ])
        setLoading(true)
        handleReset()
        const AIimages = await generateImage(prompt, images);
        // setGeneratedImages([AIimages]);
        // await bekle(20000);
        setDialogs(prev=>[...prev, 
            {
                id:uuidv4(),
                role: "ai",
                message:{
                    text: "dsadsd",
                    images: [{
                        id: uuidv4(),
                        url: AIimages,
                        // url: "https://picsum.photos/id/237/1200/1300",
                        // file: previewUrl.file
                    }]
                }
            }
        ])
        setLoading(false)
    };

    return (
        <div className='chat-container'>
            

            <div className='chat'>
                {/* Eğer hiç resim yoksa ve sohbet boşsa Uploader'ı göster.
                   Resim eklendiğinde Uploader gizlensin istiyorsan bu mantığı kullanabilirsin.
                   Şu anki haliyle her zaman görünür, CSS ile yönetilebilir.
                */}
                {images.length === 0 && dialogs.length === 0 ? (
                    <ImageUploader 
                        setPreviewUrl={setPreviewUrl} 
                        inputHeight={inputHeight} 
                    />
                ):(
                    <ChatDialogs 
                        dialogs={dialogs}
                        height={inputHeight}
                        loading={loading}
                    />
                )}
            </div>
            
            <GeminiInput 
                images={images} 
                setPreviewUrl={setPreviewUrl} 
                handleRemoveImage={(id) => {
                    setImages(prev => { 
                        var images = prev.filter(img => img.id !== id);
                        return {images}
                    });
                }}
                onSend={(prompt) => handleGenerate(prompt)}
                onHeightChange={setInputHeight} 
            />
        </div>
    )
}

