import React, { useState, useRef, useEffect } from 'react';
import { LuBrain, LuSendHorizontal } from "react-icons/lu";
import { IoAttach } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

export const GeminiInput = ({ onSend, images = [], handleRemoveImage, setPreviewUrl, onHeightChange }) => {
    const [promptLocal, setPromptLocal] = useState('');
    const textareaRef = useRef(null);
    const containerRef = useRef(null);

    // 1. Dosya Seçme Mantığı (React Yöntemi)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            
            // HATA BURADAYDI: setPreviewUrl(url) yerine aşağıdakini yazın:
            // Parent component bu objeden .url ve .file okumaya çalışıyor.
            setPreviewUrl({
                url: url,
                file: file
            }); 

        }
    };

    // 2. Kapsayıcı Yüksekliğini İzleme (ResizeObserver)
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (onHeightChange) {
                    onHeightChange(entry.contentRect.height);
                }
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [onHeightChange]);

    // 3. Textarea Otomatik Boyutlandırma
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Önce küçült
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Sonra içeriğe göre büyüt
        }
    }, [promptLocal]);

    // 4. Gönderme İşlemi
    const handleSubmit = async () => {
        if (!promptLocal.trim()) return;
        if (onSend) onSend(promptLocal);

        // Temizlik
        setPromptLocal('');

        // Textarea yüksekliğini sıfırla
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div ref={containerRef} className="chat-input-container">
            <div className="chat-input-area">
                {/* Önizleme Alanı */}
                {images.length > 0 && (
                    <div className="image-preview-container">
                        {images.map((imgObj) => (
                            <div className='image-preview-item' key={imgObj.id}>
                                <div className='close-icon'>
                                    <IoMdCloseCircle onClick={() => handleRemoveImage(imgObj.id)} />
                                </div>
                                <img
                                    src={imgObj.url}
                                    alt={`Uploaded ${imgObj.id}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {/* Metin Giriş Alanı */}
                <textarea
                    ref={textareaRef}
                    value={promptLocal}
                    onChange={(e) => setPromptLocal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buraya bir istem girin"
                    className="input-textarea"
                    rows={1}
                />

                {/* İkonlar ve Butonlar */}
                <div className="icon-container">
                    <div className="media-buttons">
                        {/* Label input'u sarmaladığı için tıklama otomatik çalışır */}
                        <label htmlFor="chat-image-upload" className="media-button" title="Resim Ekle">
                            <IoAttach size={23} />
                            <input
                                id="chat-image-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange} // React Event'i buraya bağlandı
                            />
                        </label>

                        <button className="media-button" title="LLM Seç">
                            <LuBrain size={20} />
                        </button>
                    </div>

                    <div className="send-button">
                        
                            <button
                                onClick={handleSubmit}
                                title="Gönder"
                                disabled={promptLocal.length === 0}
                            >
                                <LuSendHorizontal size={18} />
                            </button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

