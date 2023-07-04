import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      
      <Route path='/' element={<Layout />}>
        <Route index element = {<IndexPage />} />
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/login' element={<LoginPage />}></Route>
      </Route>
         
    </Routes>
      
  )
}

export default App
