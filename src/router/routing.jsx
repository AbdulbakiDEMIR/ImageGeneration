// src/router/routing.jsx
import { ImageGeneratePage } from "../pages/ImageGeneratePage/index";
import { Images } from "../pages/Images";
import { LoginPage } from "../pages/Login/LoginPage";

export const routes = [
    // Korumalı Sayfalar (Sadece üye girebilir)
    { 
        path: '/ImageGeneration/chat/:id', 
        element: <ImageGeneratePage/>, 
        isPrivate: true 
    },
    { 
        path: '/ImageGeneration/chat/', 
        element: <ImageGeneratePage/>, 
        isPrivate: true 
    },
    { 
        path: '/ImageGeneration/images/', 
        element: <Images/>, 
        isPrivate: true 
    },
    
    // Misafir Sayfaları (Üye girmesin, sadece misafirler)
    { 
        path: '/ImageGeneration/login/', 
        element: <LoginPage/>, 
        isPrivate: false, 
        isGuestOnly: true // YENİ EKLENDİ
    },
];