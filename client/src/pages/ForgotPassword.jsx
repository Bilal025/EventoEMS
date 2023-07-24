// import React from 'react'
import { Link } from "react-router-dom";

export default function ForgotPassword() {

  return (
    <div className ="flex w-full h-full px-10 py-10 justify-center place-items-center mt-20">
      <div className= "bg-white w-1/3 px-7 py-7 rounded-xl">
    
        <form className="flex flex-col w-auto items-center" onSubmit=''>
            <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl '>Forgot Password</h1>

            <div className= "input">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 100 11.668.75.75 0 011.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0121.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 11-.82-6.26V8.25a.75.75 0 011.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 00-2.416-5.834zM15.75 12a3.75 3.75 0 10-7.5 0 3.75 3.75 0 007.5 0z" clipRule="evenodd" />
              </svg>
              <input type ="email"  placeholder="Email" className="input-et" />
            </div>
            <div className="w-full py-4">
              <button type="submit" className="primary w-full"> Submit </button>
            </div>
            <Link to={'/login'} className="flex gap-2 items-center text-primary py-2 px-4 bg-primarylight cursor-pointer ring-1 ring-primarylight rounded  hover:bg-primarydark hover:shadow-lg duration-75 hover:ring-primarydark hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>

              <button className=""> Back </button>
            </Link>
        </form>
        
      </div>
    </div>
  )
}
