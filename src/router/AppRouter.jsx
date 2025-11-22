import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { routes } from './routing';

export const AppRouter = () => {

    return (
    <Router>
        <ScrollToTop />
        <Routes>
            {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}
        </Routes>
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
