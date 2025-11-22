import React, { useState, useRef} from 'react';
import { FaRegImage } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";

export const ImageUploader = ({ setPreviewUrl, inputHeight }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            // URL oluşturup parent'a gönderiyoruz
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl({
                url: url,
                file: selectedFile
            }); 

        } else {
            alert("Lütfen geçerli bir resim dosyası yükleyin.");
        }
    };

    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile);
    };

    const handleClick = () => { fileInputRef.current.click(); };
    const onInputChange = (e) => { handleFile(e.target.files[0]); };

    return (
        <div className="image-uploader">
            <div 
                className="pre-image-component" 
                // CSS değişkeni ile dinamik yükseklik ayarı (Bottom padding gibi davranır)
                style={{"--chat-input-height": `${inputHeight + 40}px`, marginBottom: `${inputHeight + 40}px`}} 
            >
                <div
                    onClick={handleClick}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`pre-image-container ${isDragging ? 'dragging' : ''}`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onInputChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className={`upload-icon ${isDragging ? 'dragging' : ''}`}>
                        {isDragging ? <FaRegImage size={32} /> : <MdOutlineFileUpload size={32} />}
                    </div>
                    <div className="upload-text">
                        <span >Resim yüklemek için tıklayın</span>
                        <br /> veya buraya sürükleyin
                    </div>
                    <p>PNG, JPG (Maks. 10MB)</p>
                </div>
            </div>
        </div>
    );
};