// import React from 'react'

import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";


export default function UserAccountPage() {
  const {user} = useContext(UserContext);

  if(!user){
    return <Navigate to={'/login'} />
  }

  return (
    <div>
      Account page for {user.name}
    </div>
  );
}
