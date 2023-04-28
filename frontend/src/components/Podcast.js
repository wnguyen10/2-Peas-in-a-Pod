import React from "react";

function Podcast({ podcast, num }) {
  // const confidence = (podcast.score * 100).toFixed(2);
  const confidence = Math.round(podcast.score * 100);
  return (
    <div className="podcast-card">
      <div className="podcast-name">
        {num}. {podcast.name}
      </div>
      <div className="podcast-pub">{podcast.publisher.name}</div>
      <div className="podcast-desc">{podcast.description}</div>
      <div className="podcast-score">{confidence + "% Match"}</div>
    </div>
  );
}

export default Podcast;
