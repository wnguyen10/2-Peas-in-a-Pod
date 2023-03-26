import React, { useState, useEffect } from "react";
import SearchBar from './SearchBar'
import PodcastData from "../data/podcasts.json"
import "./User.css"
import Tag from "./Tag";


function User({ num }) {

  const [genres, setGenres] = useState([])

  function addGenre(genre) {
    if (!genres.includes(genre)) {
      setGenres(prev => [...prev, genre])
    }
  }

  function handleDelete(genre) {
    if (genres.includes(genre)) {
      setGenres(genres.filter(x => x != genre))
    }
  }

  return (
    <div className="User">
      <h2>
        User {num}
      </h2>
      {/* Use api call to get data and pass in*/}
      <SearchBar placeholder={"Enter your favorite podcasts..."} data={PodcastData} addGenre={addGenre} />

      <div className="tags">
        {genres.length != 0 && (
          genres.map((value, key) => {
            return <Tag key={key} label={value} onDelete={handleDelete} />
          })
        )}
      </div>
    </div>
  )
}

export default User