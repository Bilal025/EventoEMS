import Header from './pages/Header'
import {Outlet} from "react-router-dom"

export default function Layout() {
  return (
    <div className='px-6'> 
      <Header />
      <Outlet />
    </div>
  )
}
