import React from 'react'
import SearchBar from './SearchBar'
import PodcastData from "../data/podcasts.json"
import "./User.css"


function User({ num }) {
  return (
    <div className="User">
      <h2>
        User {num}
      </h2>
      {/* Use api call to get data and pass in*/}
      <SearchBar placeholder={"Enter your favorite podcasts..."} data={PodcastData} />
    </div>
  )
}

export default User