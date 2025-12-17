// src/router/AuthGuard.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useLoginStore } from "../store/LoginStore"; // Önceki adımda oluşturduğumuz store

export const AuthGuard = ({ children }) => {
    const token = useLoginStore((state) => state.token); // Token var mı kontrol et
    const location = useLocation();

    // Eğer token yoksa Login sayfasına yönlendir
    // state={{ from: location }} kısmı, giriş yaptıktan sonra kullanıcıyı kaldığı yere geri göndermek için kullanılır (opsiyonel)
    if (!token) {
        return <Navigate to="/login/" state={{ from: location }} replace />;
    }
    // Token varsa çocuk bileşeni (sayfayı) render et
    return children;
};