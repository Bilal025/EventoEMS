/* eslint-disable no-unused-vars */
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'

axios.defaults.baseURL = 'http://localhost:4000/';
axios.defaults.withCredentials=true;


function App() {
  return (
    <UserContextProvider> 
    <Routes>
      
      <Route path='/' element={<Layout />}>
        <Route index element = {<IndexPage />} />
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/login' element={<LoginPage />}/>
        
      </Route>
         
    </Routes>
    </UserContextProvider>  
  )
}

export default App
