import { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../UserContext'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState('');
  const {setUser} = useContext(UserContext);

  async function loginUser(ev){
      ev.preventDefault();

      try{
        const {data} = await axios.post('/login', {email, password})
        setUser(data);
        alert('Login success');

        setRedirect(true)
      }catch(e){
        alert('Login failed');
      }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  
  return (
    <div className ="flex w-full h-full ml-24 px-10 py-10 justify-between place-items-center">
      <div className= "bg-white w-1/3 px-7 py-7 rounded-xl ">
    
        <form className="flex flex-col w-auto items-center" onSubmit={loginUser}>
            <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl'>Sign In</h1>


            <div className= "input">
              {/* <img src={account} alt="Name" className="name"/> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 100 11.668.75.75 0 011.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0121.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 11-.82-6.26V8.25a.75.75 0 011.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 00-2.416-5.834zM15.75 12a3.75 3.75 0 10-7.5 0 3.75 3.75 0 007.5 0z" clipRule="evenodd" />
              </svg>

              <input type ="email"  placeholder="Email" className="input-et" value={email} onChange={ev => setEmail(ev.target.value)}/>
            </div>

            <div className= "input">
              {/* <img src={account} alt="Name" className="name"/> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
              </svg>

              <input type ="password"  placeholder="Password" className="input-et" value={password} onChange={ev => setPassword(ev.target.value)}/>
            </div>

            <div className='flex w-full h-full mt-4 justify-between px-1'>
              <div className='flex gap-2'>
              <input  type="checkbox" /> 
              Remember Me
              </div>
              <div>
                <a href="#">
                  Forgot Password ?
                </a>
              </div>
              
            </div>

            
            <div className="w-full py-4">
            <button type="submit" className="primary w-full"> Sign in </button>
            </div>

            <div className="container2 ">
              <div className="slider">
                <Link to={'/Register'}>
                  <button type="submit" className="slider-signup-btn" > Sign Up</button>
                </Link>
              </div>
              <Link to={'/login'}>
                <div className="slider">
                    <button type="submit" className="slider-signin-btn"> Sign In</button>
                </div>
              </Link>
            </div>

        </form>

    </div>
   
    <div className= "flex flex-col right-box">
      <div className='flex flex-col -ml-96 gap-3'>
        <div className='text-3xl font-black'>Welcome to</div>
        <div>
          <img src="../src/assets/logo.png" alt="" className="w-48"/>
        </div>
      </div>

        <div className="-ml-48 w-80 mt-12">
          <img src="../src/assets/signinpic.svg" alt="" className='w-full'/>
        </div>   
        
    </div>
  </div>
  )
}
