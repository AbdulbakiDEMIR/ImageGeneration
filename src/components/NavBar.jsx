import { BsLayoutSidebarReverse } from "react-icons/bs";

export const NavBar = () => {
  
  return (
    <div className='nav-container'>
        <label htmlFor="menu-toggle">
            <BsLayoutSidebarReverse  className='cursor-pointer'/>
        </label>
    </div>
  )
}
