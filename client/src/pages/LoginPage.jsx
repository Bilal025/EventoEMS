import { Link } from 'react-router-dom'
import './Login.css'


export default function LoginPage() {
  return (
    <div className='outermainDiv'>
     <div className='outerdiv'>
     
     
     <div className='imageHolder'>
     <p className='welocme'>Welcome to</p>
     {/* <img className='logoImage' src={logo} alt="dwadawd"/>
     <img className='welcomImage' src={loginImg} alt="dwadawd"/> */}
     </div>

     <div className='inforHolder'>
        <h1 className='signText'>Sign In</h1>

        <div className='InputHolder'>
        <form>
        

        <div className="inputGroup">
        <p className='inputText'>Email</p>
        <i className="fa-solid fa-envelope"></i>
        <input className='EmailPut' type="email" placeholder='Email address' autoComplete="offf"/>
        </div>


        <div className="inputGroup">
        <p className='inputText'>password</p>
        <i className="fa-solid fa-lock"></i>
        <input className='passwordPut' type="password" placeholder='Password' autoComplete="offf" />
        <i className="fa-solid fa-eye"></i>
        </div>

        <div className='forgetpasswordDiv'>
        <input className='cjeckBtInput' type="checkbox" placeholder='Password' /> <span className='rememberMe'>Remember me</span> <a href="" className='forgetpassword'>Forgot password?</a>


             
          </div>
          <input className='loinbutton' type="submit" value="Login"/>

          <div className="actionBtns">
            <Link  to={'/register'}>
               <button className="actionBtn signupBtn">sign Up</button>
            </Link>
            <button className="actionBtn loginBtn">sign In</button>
            
        </div>

          
        </form>
        
          

         
        </div>
        
     </div>
     </div>
     </div>
  )
}
