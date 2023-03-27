import React from 'react'

function Podcast({ podcast, num }) {
  return (
    <div className='podcast-card'>
      <div className='podcast-name'>{num}. {podcast.name}</div>
      <div className='podcast-pub'>{podcast.publisher.name}</div>
      <div className='podcast-desc'>{podcast.description}</div>
    </div>
  )
}

export default Podcast