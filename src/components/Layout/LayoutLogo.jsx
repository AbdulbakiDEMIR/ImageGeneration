import { Link } from 'react-router-dom'


export const LayoutLogo = () => {
  return (
    <Link to={`/`}>
        <img className='mx-auto mb-3 w-100' src={`/storage/images/neo_logo.png`} alt='logo'/>
    </Link>
  )
}
