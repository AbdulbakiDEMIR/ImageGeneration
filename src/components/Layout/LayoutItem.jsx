import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineDelete } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { useChatDeleteFastPageStore } from '../../store/ChatDeleteFastPageStore';
import { useChatUpdateFastPageStore } from '../../store/ChatUpdateFastPageStore';

export const  LayoutItem = ({ text, path, editable=false}) => {
	const { pathname } = useLocation();
	const id = pathname.split('/').pop();
	const active = id === path;

	const setDeleteFastPage = useChatDeleteFastPageStore((state)=>state.setDeleteFastPage)
	const setDeleteFastPageId = useChatDeleteFastPageStore((state)=>state.setDeleteFastPageId)

	const setUpdateFastPage = useChatUpdateFastPageStore((state)=>state.setUpdateFastPage)
	const setUpdateFastPageId = useChatUpdateFastPageStore((state)=>state.setUpdateFastPageId)

	    // 1. Popover'ın görünürlüğünü kontrol eden state
    const [show, setShow] = useState(false);
	
	useEffect(()=>{
		if(show){
			const layout_items = document.querySelector("#root > div > div.layout-container > div.layout-items")
			if(layout_items){
				layout_items.style.overflowY = "hidden"
			}
		}else{
			const layout_items = document.querySelector("#root > div > div.layout-container > div.layout-items")
			if(layout_items){
				layout_items.style.overflowY = ""
			}
		}
	},[show])
    // Kapatma fonksiyonu
    const handleClose = () => setShow(false);

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

	const handleOpenDeleteChatPopover = ()=>{
		setDeleteFastPage(true)
		setDeleteFastPageId(path)
		setShow(false)
	}

	const handleOpenUpdateChatPopover = ()=>{
		setUpdateFastPage(true)
		setUpdateFastPageId(path)
		setShow(false)
	}


    const popover = (
        <Popover className='layout-item-editable-popover-container'>
            <Popover.Body className='layout-item-editable-popover'>
				<div className='layout-item-editable-popover-item' onClick={()=>handleOpenUpdateChatPopover()} style={{color:"#2dae58"}}>
					<GoPencil/>
					<span>Düzenle</span>
				</div>
                <div className='layout-item-editable-popover-item' onClick={()=>handleOpenDeleteChatPopover()} style={{color:"#ae2d2d"}}>
					<MdOutlineDelete/>
					<span>Sil</span>
				</div>
            </Popover.Body>
        </Popover>
    );
	
	return (
		<div className={`layout-item-container ${active ? 'active' : ''} ${show ? 'hover' : ''}`}>
			<Link to={'/chat/'+path} className={`layout-item`}>
				<span>{text}</span>
			</Link>
			{editable &&
			
			<OverlayTrigger
				trigger="click"
				placement="right"
				overlay={popover}
				// 4. State'i OverlayTrigger'a bağlıyoruz
				show={show}
				onToggle={(nextShow) => setShow(nextShow)}
				// 5. rootClose={true}: Dışarı (rastgele bir yere) tıklandığında kapanmayı sağlar
				rootClose={true} 
			>
				<HiDotsVertical className='layout-item-editable-icon'/>
			</OverlayTrigger>
			}
			
		</div>
	);
};
