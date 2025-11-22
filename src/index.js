import { createRoot } from 'react-dom/client';
import { AppRouter } from './router/AppRouter';
import './style/app.css';
const App = () => {
    return (
    <>
        <AppRouter />
    </>
    );
};


const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

