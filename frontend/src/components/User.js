import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
// import PodcastData from "../data/podcasts.json"
import "./User.css";
import Tag from "./Tag";

function User({ num, pubData, publishers, setPublishers, advanced }) {
  function addPublisher(pub) {
    if (!publishers.includes(pub)) {
      setPublishers((prev) => [...prev, pub]);
    }
  }

  function handleDelete(pub) {
    if (publishers.includes(pub)) {
      setPublishers(publishers.filter((x) => x != pub));
    }
  }

  return (
    <div className="User">
      <h2>User {num}</h2>

      {advanced && (
        <>
          <SearchBar
            placeholder={"Enter your favorite podcasts..."}
            pubData={pubData}
            addPublisher={addPublisher}
          />
          <SearchBar
            placeholder={"Enter your favorite genres..."}
            pubData={pubData}
            addPublisher={addPublisher}
          />
          <SearchBar
            placeholder={"Enter your favorite publishers..."}
            pubData={pubData}
            addPublisher={addPublisher}
          />
        </>
      )}
      {!advanced && (
        <SearchBar
          // placeholder={"Enter your favorite publishers..."}
          pubData={pubData}
          addPublisher={addPublisher}
        />
      )}

      <div className="tags">
        {publishers.length != 0 &&
          publishers.map((value, key) => {
            return <Tag key={key} label={value} onDelete={handleDelete} />;
          })}
      </div>
    </div>
  );
}

export default User;
