// src/pages/Login/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from '../../store/LayoutStore';
import { useLoginStore } from '../../store/LoginStore'; // Store import

export const LoginPage = () => {
    const [username, setUsername] = useState(""); // Değişken ismini düzelttim (setEmail -> setUsername)
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // Hata mesajı için state
    const [loading, setLoading] = useState(false); // Yükleniyor durumu

    const navigate = useNavigate();
    
    // Layout store işlemi
    const setLayout = useLayoutStore((state) => state.setLayout);
    // Login fonksiyonunu store'dan al
    const fetchLogin = useLoginStore((state) => state.fetchLogin);

    // Component mount olduğunda layout'u kapat
    // Not: Bunu useEffect içinde yapmak daha sağlıklıdır
    // React render aşamasında state değiştirmek sonsuz döngüye sokabilir.
    useState(() => {
         setLayout(false);
    }, []);

    const handleLogin = async () => {
        if(!username || !password) {
            setError("Lütfen tüm alanları doldurun.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await fetchLogin(username, password);
            // Başarılı olursa yönlendir
            navigate('/ImageGeneration/chat');
        } catch (err) {
            // Hata mesajını backend'den al veya genel bir mesaj göster
            setError("Giriş başarısız. Kullanıcı adı veya şifre hatalı.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='login-container'>
                <div className='login-box'>
                    <h2 className='text-center mb-4'>Giriş Yap</h2>
                    
                    {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

                    <div className='login-input'>
                        <label htmlFor='username' className='mb-2'>Kullanıcı Adı</label>
                        <input 
                            id='username' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            type='text' 
                            placeholder='example'
                        />
                    </div>
                    
                    <div className='login-input'>
                        <label htmlFor='password' className='mb-2'>Şifre</label>
                        <input 
                            id='password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            type='password' 
                            placeholder='Şifre'
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Enter tuşu desteği
                        />
                    </div>

                    <div 
                        onClick={!loading ? handleLogin : null} 
                        className={`btn ${loading ? 'disabled' : ''}`}
                        style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                    > 
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </div>
                </div>
            </div>
        </>
    );
}