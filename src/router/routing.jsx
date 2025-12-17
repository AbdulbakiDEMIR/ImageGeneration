// src/router/routing.jsx
import { ImageGeneratePage } from "../pages/ImageGeneratePage/index";
import { Images } from "../pages/Images";
import { LoginPage } from "../pages/Login/LoginPage";

export const routes = [
    // Korumalı Sayfalar (Sadece üye girebilir)
    { 
        path: '/chat/:id', 
        element: <ImageGeneratePage/>, 
        isPrivate: true 
    },
    { 
        path: '/chat/', 
        element: <ImageGeneratePage/>, 
        isPrivate: true 
    },
    { 
        path: '/images/', 
        element: <Images/>, 
        isPrivate: true 
    },
    
    // Misafir Sayfaları (Üye girmesin, sadece misafirler)
    { 
        path: '/login/', 
        element: <LoginPage/>, 
        isPrivate: false, 
        isGuestOnly: true // YENİ EKLENDİ
    },
    // Opsiyonel: Kök dizine gelindiğinde login'e yönlendir
    {
        path: '/',
        element: <LoginPage/>,
        isPrivate: false,
        isGuestOnly: true
    }
];