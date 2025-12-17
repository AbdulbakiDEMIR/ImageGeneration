// src/components/Layout/Layout.jsx
import { LayoutItem } from './LayoutItem'
import { LayoutUser } from './LayoutUser'
import { NavBar } from '../NavBar'
import { useEffect, useState } from 'react'
import { useLayoutChatStore } from '../../store/LayoutChatStore'
import { useLocation, useNavigate } from 'react-router-dom'
import { FastPage } from '../FastPage'
import { useChatDeleteFastPageStore } from '../../store/ChatDeleteFastPageStore'
import { useChatUpdateFastPageStore } from '../../store/ChatUpdateFastPageStore'

export const Layout = () => {
	const chats = useLayoutChatStore((state)=>state.chats)
	const { pathname } = useLocation();
	const fetchChats = useLayoutChatStore((state)=>state.fetchChats)
	const [updateTitle, setUpdateTitle] = useState('')
    const navigate = useNavigate();

	const deleteFastPageId = useChatDeleteFastPageStore((state)=>state.deleteFastPageId)
	const deleteFastPage = useChatDeleteFastPageStore((state)=>state.deleteFastPage)
	const setDeleteFastPage = useChatDeleteFastPageStore((state)=>state.setDeleteFastPage)
	const setDeleteFastPageId = useChatDeleteFastPageStore((state)=>state.setDeleteFastPageId)
	const setDeleteChat = useChatDeleteFastPageStore((state)=>state.setDeleteChat)

	const updateFastPageId = useChatUpdateFastPageStore((state)=>state.updateFastPageId)
	const updateFastPage = useChatUpdateFastPageStore((state)=>state.updateFastPage)
	const updateConfirm = useChatUpdateFastPageStore((state)=>state.updateConfirm)
	const setUpdateFastPage = useChatUpdateFastPageStore((state)=>state.setUpdateFastPage)
	const setUpdateFastPageId = useChatUpdateFastPageStore((state)=>state.setUpdateFastPageId)
	const setUpdateConfirm = useChatUpdateFastPageStore((state)=>state.setUpdateConfirm)
	const fetchUpdateChat = useChatUpdateFastPageStore((state)=>state.fetchUpdateChat)
	const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const shouldBeChecked = window.innerWidth < 580;
            setIsMenuOpen(shouldBeChecked);
            
            const app = document.querySelector('#root');
            if(shouldBeChecked){
                app.classList.add('small');
            } else {
                app.classList.remove('small');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        fetchChats();
        return () => window.removeEventListener('resize', handleResize);
    }, []);



	useEffect(()=>{
		if(updateFastPageId !== ""){
			const chat = chats.find(item=>item._id === updateFastPageId)
			setUpdateTitle(chat.title)
		}else setUpdateTitle("")
	},[updateFastPageId])


	useEffect(()=>{
		try{
			const url = pathname.split('/')
			const id = url.pop();
			if(id === "" || undefined){
				document.title = "New Chat"
			}
			else {
				const chat = chats?.find(item=>item._id === id)
				const path = url.pop()
				if(path === 'chat'){
					if(chat){document.title = chat.title}
					else{navigate(`/chat/`);}
				}else{
					document.title = "Image Generate"
				}
			}
		}catch{
			document.title = "Image Generate"
		}
	},[chats,pathname])

	const handleMenuToggle = (e) => {
        const isChecked = e.target.checked;
        setIsMenuOpen(isChecked); // State'i güncelle (Çok önemli!)
        
        // Mevcut sınıf mantığın
        const app = document.querySelector('#root');
        if(isChecked){
            app.classList.add('small')
        }
        else{
            app.classList.remove('small')
        }
    }

	const handleCloseDeleteFastPage = () =>{
		setDeleteFastPage(false)
		setDeleteFastPageId('')
	}

	const handleCloseDelete = async () =>{
		await setDeleteChat()
		await fetchChats();
	}



	const handleCloseUpdateUpdate = () =>{
		setUpdateFastPage(false)
		setUpdateFastPageId('')
	}
	const handleCloseConfirmUpdateUpdate = () =>{
		setUpdateConfirm(false)
	}

	const handleOpenConfirmUpdate = () =>{
		setUpdateConfirm(true)
	}
	const handleUpdateTitle = async () =>{
		await fetchUpdateChat(updateTitle)
		await fetchChats();
		setUpdateTitle("")
	}

	return (
		<>
			<input 
                type="checkbox" 
                id="menu-toggle" 
                checked={isMenuOpen} 
                onChange={(e) => handleMenuToggle(e)} 
                className='d-none'
            />
			<div className='layout-container'>
				<NavBar/>
				
				<div className='layout-items'> 
					<LayoutItem text="New Chat" path="" />
					<hr style={{background:"#444", height:"1px", margin:"10px 0"}}/>
					{chats?.map((item, index) => (
					<LayoutItem key={index}  text={item.title} path={item._id} editable={true}/>
					))}
				</div>
				<LayoutUser />
			</div>
			{deleteFastPage && 
				<FastPage title="Sil" close={()=>handleCloseDeleteFastPage()}>
					<p className='delete-chat-fast-page-text'>"{chats.find(item => item._id === deleteFastPageId).title}" silinsin mi?</p>
					<div className='delete-chat-fast-page-buttons'>
						<button onClick={()=>handleCloseDeleteFastPage()}>İptal</button>
						<button onClick={()=>handleCloseDelete()} className='delete'>Sil</button>
					</div>
				</FastPage>
			}
			{updateFastPage && 
				<FastPage title="İsim Güncelle" close={()=>handleCloseUpdateUpdate()}  zIndex={110}>
					<input type='text' className='update-chat-fast-page-input-text' value={updateTitle} onChange={(e)=>setUpdateTitle(e.target.value)}/>
					<div className='update-chat-fast-page-buttons'>
						<button onClick={()=>handleCloseUpdateUpdate()}>İptal</button>
						<button onClick={()=>handleOpenConfirmUpdate()} className='update'>Güncelle</button>
					</div>
				</FastPage>
			}
			{updateConfirm && 
				<FastPage title="Güncelle" close={()=>handleCloseConfirmUpdateUpdate()} zIndex={110}>
					<p>"{chats.find(item => item._id === updateFastPageId).title}" başlığı "{updateTitle}" olarak değiştirmek istermisiniz?</p>
					<div className='update-chat-fast-page-buttons'>
						<button onClick={()=>handleCloseConfirmUpdateUpdate()}>İptal</button>
						<button onClick={()=>handleUpdateTitle()} className='update'>Kaydet</button>
					</div>
				</FastPage>
			}
		</>
	)
}
