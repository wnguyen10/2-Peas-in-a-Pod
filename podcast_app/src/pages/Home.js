import React from 'react'
import Results from '../components/Results'
import User from '../components/User'
import "./Home.css"


function Home() {
  return (
    <div className='Home'>
      <h1 className='Title'>
        2 Peas in a Pod
      </h1>
      <div className='Users'>
        <User num={1} />
        <User num={2} />
      </div>
      <button className='submit-button'>Submit</button>
      <div className='Results'>
        <Results />
      </div>
    </div>
  )
}

export default Home