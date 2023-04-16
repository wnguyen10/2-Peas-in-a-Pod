import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import "./User.css";
import Tag from "./Tag";

function User({
  num,
  pubData,
  publisherPrefs,
  setPublisherPrefs,
  genreData,
  genrePrefs,
  setGenrePrefs,
  podcastData,
  podcastPrefs,
  setPodcastPrefs,
  isAdvanced,
}) {
  function addPublisher(pub) {
    if (!publisherPrefs.includes(pub)) {
      setPublisherPrefs((prev) => [...prev, pub]);
    }
  }

  function addPodcast(pod) {
    if (!podcastPrefs.includes(pod)) {
      setPodcastPrefs((prev) => [...prev, pod]);
    }
  }

  function addGenre(genre) {
    if (!genrePrefs.includes(genre)) {
      setGenrePrefs((prev) => [...prev, genre]);
    }
  }

  function handleDelete(x, type) {
    if (type === "podcast") {
      setPodcastPrefs(podcastPrefs.filter((p) => p != x));
    } else if (type === "genre") {
      setGenrePrefs(genrePrefs.filter((p) => p != x));
    } else if (type === "publishers") {
      setPublisherPrefs(publisherPrefs.filter((p) => p != x));
    }
  }

  return (
    <div className="User">
      <h2>User {num}</h2>

      {isAdvanced && (
        <>
          <SearchBar
            placeholder={"Enter your favorite podcasts..."}
            pubData={pubData}
            addPublisher={addPublisher}
          />
          <SearchBar
            placeholder={"Enter your favorite genres..."}
            pubData={pubData}
            addPublisher={addGenre}
          />
          <SearchBar
            placeholder={"Enter your favorite publishers..."}
            pubData={pubData}
            addPublisher={addPodcast}
          />
        </>
      )}
      {!isAdvanced && (
        <SearchBar
          // placeholder={"Enter your favorite publishers..."}
          pubData={pubData}
          addPublisher={addPublisher}
        />
      )}

      <div className="tags">
        {podcastPrefs.length != 0 &&
          podcastPrefs.map((value, key) => {
            return (
              <Tag
                key={key}
                label={value}
                onDelete={(x) => handleDelete(x, "podcast")}
              />
            );
          })}
      </div>

      <div className="tags">
        {genrePrefs.length != 0 &&
          genrePrefs.map((value, key) => {
            return (
              <Tag
                key={key}
                label={value}
                onDelete={(x) => handleDelete(x, "genre")}
              />
            );
          })}
      </div>

      <div className="tags">
        {publisherPrefs.length != 0 &&
          publisherPrefs.map((value, key) => {
            return (
              <Tag
                key={key}
                label={value}
                onDelete={(x) => handleDelete(x, "publisher")}
              />
            );
          })}
      </div>
    </div>
  );
}

export default User;
