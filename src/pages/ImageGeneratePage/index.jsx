import { useState, useEffect } from 'react';
import { GeminiInput } from './layouts/GeminiInput';
import { ChatDialogs } from './layouts/ChatDialogs';
import { ImageFullpage } from '../../components/ImageFullpage';
import { FastPage } from '../../components/FastPage';
import { useParams, useNavigate } from 'react-router-dom';
import { useImageStore } from '../../store/imageStore';
import { useChatStore } from '../../store/chatStore'; // Store importu
import { useImageFullpageStore } from '../../store/ImageFullpageStore';
import { useLayoutChatStore } from '../../store/LayoutChatStore';
import { useLayoutStore } from '../../store/LayoutStore';

import axiosClient from '../../api/axiosClient';


export const ImageGeneratePage = () => {
    const { id } = useParams();
    const [inputHeight, setInputHeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const [chatTitleInput, setChatTitleInput] = useState('');
    const [chatTitleFastPageOpen, setChatTitleFastPageOpen] = useState(true);
    const navigate = useNavigate();
    const setLayout = useLayoutStore((state)=>state.setLayout)
    setLayout(true)
   
    // Image Store
    const imageData = useImageStore((state) => state.imageData);
    const saveBlobImage = useImageStore((state) => state.saveBlobImage);
    const removeAllImage = useImageStore((state) => state.removeAllImage);
    
    // Chat Store 
    const chatDialogs = useChatStore((state) => state.dialogs);
    const fetchChats = useChatStore((state) => state.fetchChats);
    const addMessage = useChatStore((state) => state.addMessge); 
    const fetchCreateChat = useChatStore((state) => state.fetchCreateChat);
    const restartChat = useChatStore((state) => state.restartChat);
    const setChatWait = useChatStore((state) => state.setChatWait);
    const chatWait = useChatStore((state) => state.chatWait);
    const setChatTitle = useChatStore((state) => state.setChatTitle);

    const IF_isOpen = useImageFullpageStore((state) => state.isOpen);

    const fetchLayoutChats = useLayoutChatStore((state)=>state.fetchChats)

    useEffect(() => {
        if (id) {fetchChats(id);}
        else{restartChat(); setChatTitleFastPageOpen(true)}
    }, [id]);

    const handleCreateTitle = () => {
        if(chatTitleInput.length>0) {
            setChatTitle(chatTitleInput)
            setChatTitleFastPageOpen(false)
        }
    }

    const handleGenerate = async (prompt) => {
        if (!prompt) return; 
        let setParams = false;
        setLoading(true);
        setChatWait(true);
        try {
            let currentChatId = useChatStore.getState().chatId;
            const isFirstMessage = useChatStore.getState().firstMessage;
            const sendImageData = [...imageData]; 

            removeAllImage();

            if (isFirstMessage) {
                setParams = true;
                await fetchCreateChat();
                currentChatId = useChatStore.getState().chatId; 
            }
            const userMessage = {
                role: "user",
                content: prompt,
                images: sendImageData 
            };

            addMessage(userMessage);
            const uploadedImages = await saveBlobImage(sendImageData)


            
            const backendImagesData = uploadedImages.map(img => ({
                id: img.pathname, 
                url: img.url 
            }));

            const finalUserMessage = {
                role: "user",
                content: prompt,
                images: backendImagesData
            };

            const res = await axiosClient.post(`/chat/${currentChatId}`, { // currentChatId kullanıyoruz!
                message: finalUserMessage
            });

            if(setParams){
                fetchLayoutChats()
                navigate(`${currentChatId}`);
            }
            addMessage(res.data.aiMessage);

        } catch (error) {
            console.error("Mesaj gönderme hatası:", error);
        } finally {
            setLoading(false);
            setChatWait(false);
        }
    };

    return (
        <div className='app-router-container'>
            <div className='chat-container'>
                <div className='chat'>
                    {imageData.length === 0 && chatDialogs.length === 0 && !id ? (
                        <></>
                    ) : (
                        <ChatDialogs
                            dialogs={chatDialogs}
                            height={inputHeight}
                            loading={loading}
                        />
                    )}
                </div>

                <GeminiInput
                    ChatState={{ chatWait }}
                    onSend={handleGenerate}
                    onHeightChange={setInputHeight}
                />
            </div>
            {IF_isOpen && (<ImageFullpage/>)}
            {(!id && chatTitleFastPageOpen) && (
                <FastPage 
                    title={"Başlık Oluştur"}
                    >
                    <div className='fastpage-body-box'>
                        <input placeholder='New Chat' className='text-input' type='text' value={chatTitleInput} onChange={(e)=>{setChatTitleInput(e.target.value)}}/>
                        <div className='buttons'>
                            <button className='button' onClick={()=>handleCreateTitle()} disabled={chatTitleInput?.length === 0} >Oluştur</button>
                        </div>
                    </div>
                </FastPage>
            )}
        </div>
    );
};