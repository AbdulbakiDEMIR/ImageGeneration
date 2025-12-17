import React, { useRef, useEffect } from 'react'
import { IoClose } from "react-icons/io5";

export const FastPage = ({ children ,title, close, zIndex=20, position=""}) => {
    const fastPageBackgound = useRef(null)
    const handelClickBackground = (e)=>{
        if(fastPageBackgound.current===e.target && close) close()
    }

    useEffect(() => {
        // Klavye olayını yakalayan fonksiyon
        if(close){
            const handleKeyDown = (event) => {
                if (event.key === 'Escape') {
                    close();
                }
            };
            
            window.addEventListener('keydown', handleKeyDown);
            
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, []); 

    return (
        <div className='fast-page-background' ref={fastPageBackgound} style={{zIndex:zIndex, position:position}} onClick={(e)=>{handelClickBackground(e)}}>
            <div className='fast-page-container'>
                <div className='fast-page-header'>
                    {title}
                    {close && 
                    <IoClose className='fast-page-close' onClick={close}/>
                    }
                </div>
                <div className='fast-page-body'>
                    {children}
                </div>
            </div>
        </div>
    )
}
