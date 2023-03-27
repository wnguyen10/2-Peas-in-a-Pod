import React from 'react'
import Podcast from './Podcast'
import './Results.css'

function Results() {
  return (
    <div>
      <h1>
        Results
      </h1>
      <h4>Here is your shared curated podcast playlist:</h4>
      <div className='results'>
        <Podcast />
      </div>
    </div>
  )
}

export default Results