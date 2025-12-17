import React, { useState, useEffect } from 'react';
import { RxAvatar, RxExit } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLoginStore } from '../../store/LoginStore';

export const LayoutUser = () => {
    const fetchLogout = useLoginStore((state)=>state.fetchLogout)

    // 1. Popover'ın görünürlüğünü kontrol eden state
    const [show, setShow] = useState(false);

    // Kapatma fonksiyonu
    const handleClose = () => setShow(false);

    const handleLogout = async () => {
        await fetchLogout()
        handleClose();
    }

    // 2. ESC tuşu kontrolü için useEffect
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        // Sadece popover açıkken dinleyici ekle
        if (show) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Temizlik işlemi
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [show]);

    const popover = (
        <Popover id="user-popover" className="user-popover">
            <Popover.Body>
                {/* 3. Linke tıklandığında kapanması için onClick ekledik */}
                <Link 
                    to={`/images`} 
                    className='user-popover-item' 
                    onClick={handleClose}
                >
                    <FaRegImage />
                    <span>Resimler</span>
                </Link>
                
                {/* 3. Logout butonuna tıklandığında kapanması için onClick ekledik */}
                <div 
                    className='user-popover-item' 
                    onClick={()=>handleLogout()}
                    style={{ cursor: 'pointer' }} // Tıklanabilir olduğunu göstermek için
                >
                    <RxExit />
                    <span>Logout</span>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            placement="top"
            overlay={popover}
            // 4. State'i OverlayTrigger'a bağlıyoruz
            show={show}
            onToggle={(nextShow) => setShow(nextShow)}
            // 5. rootClose={true}: Dışarı (rastgele bir yere) tıklandığında kapanmayı sağlar
            rootClose={true} 
            className='layout-user-container'
        >
            <div className='layout-user'>
                <div className="layout-item">
                    <div className='layout-user-avatar'>
                        <RxAvatar />
                    </div>
                    <span>Admin</span>
                </div>
            </div>
        </OverlayTrigger>
    );
}