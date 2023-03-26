import React from 'react'
import User from '../components/User'
import "./Home.css"
import logo from "../data/logo.png"

function Home() {
  return (
    <div className='Home'>
      <div className='Title'>
        <img src={logo} width="400" height="300" />
        <text> 2 PEAS IN A POD</text>
      </div>
      <div>  <p> Input your favorite stations and find your perfect blend:</p></div>
      <div className='Users'>
        <User num={1} />
        <User num={2} />
      </div>
      <div>
        <button type="button">Find Matches!</button>
      </div>
    </div>
  )
}

export default Home