// src/router/AppRouter.jsx
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { routes } from './routing';
import { Layout } from '../components/Layout/Layout';
import { useLayoutStore } from '../store/LayoutStore';
import { AuthGuard } from './AuthGuard';
import { GuestGuard } from './GuestGuard'; // YENİ IMPORT

export const AppRouter = () => {
    const isLayout = useLayoutStore((state) => state.isLayout);

    return (
        <Router basename="/ImageGeneration">
            <div style={{ display: "flex" }}>
                <ScrollToTop />
                {isLayout && <Layout />}
                <Routes>
                    {routes.map((route) => {
                        const { path, element, isPrivate, isGuestOnly } = route;
                        
                        // Hangi Guard ile sarmalayacağımıza karar verelim
                        let finalElement = element;

                        if (isPrivate) {
                            // Sadece giriş yapanlar girebilir
                            finalElement = <AuthGuard>{element}</AuthGuard>;
                        } else if (isGuestOnly) {
                            // Sadece giriş YAPMAMIŞ olanlar girebilir (Login sayfası gibi)
                            finalElement = <GuestGuard>{element}</GuestGuard>;
                        }

                        return (
                            <Route 
                                key={path} 
                                path={path} 
                                element={finalElement} 
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
};

function ScrollToTop() {
    const { key, pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [key, pathname]);
    return null;
}