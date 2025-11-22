import React, { useRef, useEffect } from 'react'

export const ChatDialogs = ({dialogs, height}) => {
    const lastAiMessageRef = useRef(null);
    useEffect(() => {
        // Eğer ref bir elemente bağlandıysa (yani son mesaj AI ise)
        if (lastAiMessageRef.current) {
            lastAiMessageRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' // 'start': Elemanın üstü ekranın üstüne hizalanır
            });
        }
    }, [dialogs]);
    console.log("-----------------------------------")

    return (
        <div className="dialog-container"  style={{"--dialog-container-height": `${height + 40}px`, marginBottom: `${height + 40}px`}}>
            {dialogs.map((dialog, index)=>{
                const role = dialog.role;
                const isLastAiMessage = index === dialogs.length - 1 && role === 'ai';
                console.log(dialog)
                return(
                    <div ref={isLastAiMessage ? lastAiMessageRef : null} key={index} className="message-container">
                        <div className={`message-box ${role}`}>
                            {dialog.message.images?.length > 0 && (
                                <div className='message-images'>
                                    {dialog.message.images.map(image=>{    
                                        return(
                                            <img key={image.id} src={image.url} alt={"image "+image.id}/>
                                        )
                                    })}
                                </div>
                            )}

                            {dialog.message.text}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
