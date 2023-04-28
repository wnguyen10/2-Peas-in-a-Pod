import React, { useState } from "react";
import "./Likedislike.css";
import axios from "axios";

function Likedislike({ user1, user2, podcast, recs, setRecs, num, isRelevantActive, setIsRelevantActive, isIrrelevantActive, setIsIrrelevantActive }) {
  const [isRelevantActive1, setIsRelevantActive1] = useState(false);
  const [isIrrelevantActive1, setIsIrrelevantActive1] = useState(false);

  function handleClickRelevant() {
    setIsRelevantActive1(!isRelevantActive1);
    setIsIrrelevantActive1(false);
    isRelevantActive[num] = !isRelevantActive[num]
    isIrrelevantActive[num] = false
    setIsRelevantActive(isRelevantActive)
    setIsIrrelevantActive(isIrrelevantActive)
    axios({
      method: "POST",
      url: "http://4300showcase.infosci.cornell.edu:4546/api/feedback/",
      data: JSON.stringify({
        podcast: podcast["name"],
        relevant: true,
        recs: recs,
        user1: user1,
        user2: user2,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        const res = response.data;
        console.log("Clicked like button");
        console.log(res)

      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

  };

  function handleClickIrrelevant() {
    isRelevantActive = [false, false, false, false, false, false, false, false, false, false]
    setIsRelevantActive(isRelevantActive)
    axios({
      method: "POST",
      url: "http://4300showcase.infosci.cornell.edu:4546/api/feedback/",
      data: JSON.stringify({
        podcast: podcast["name"],
        relevant: false,
        recs: recs,
        user1: user1,
        user2: user2,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        const res = response.data;
        console.log("Clicked the dislike button");
        console.log(res)
        setRecs(res);

      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });



  };

  return (
    <div className="rating">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <div className="like grow">
        <i className={`fa fa-thumbs-up fa-3x like ${isRelevantActive[num] ? 'active' : ''}`} aria-hidden="true" onClick={handleClickRelevant}></i>
      </div>
      <div className="dislike grow">
        <i className={`fa fa-thumbs-down fa-3x dislike ${isIrrelevantActive[num] ? 'active' : ''}`} aria-hidden="true" onClick={handleClickIrrelevant}></i>
      </div>
    </div>
  )
}

export default Likedislike