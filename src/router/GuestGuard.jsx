// src/router/GuestGuard.jsx
import { Navigate } from "react-router-dom";
import { useLoginStore } from "../store/LoginStore";
import { useEffect, useState } from "react";

export const GuestGuard = ({ children }) => {
    const token = useLoginStore((state) => state.token);
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydration (Veri yükleme) kontrolü
    useEffect(() => {
        const unsub = useLoginStore.persist.onFinishHydration(() => setIsHydrated(true));
        if (useLoginStore.persist.hasHydrated()) setIsHydrated(true);
        return () => unsub && unsub();
    }, []);

    if (!isHydrated) return null; // Yüklenirken bekle

    // Eğer token VARSA, kullanıcı zaten giriş yapmıştır.
    // Onu login sayfasında tutma, ana sayfaya gönder.
    if (token) {
        return <Navigate to="/chat/" replace />;
    }

    // Token yoksa (misafir ise) sayfayı göster
    return children;
};