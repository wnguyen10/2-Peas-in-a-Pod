import React, { useState } from "react";
import "./Likedislike.css";
import axios from "axios";

function Likedislike({ podcast, recs, setRecs }) {

  // deletes the podcast that user indicates strong dislike
  function handlePodcastDelete() {
    setRecs(recs.filter((p) => p != podcast))
  }

  // renders the next podcast that's the most relevant
  function renderNextPodcast() {
    // axios({
    //   method: "GET",
    //   url: "http://4300showcase.infosci.cornell.edu:4546/api/____",
    // })
    //   .then((response) => {
    //     const res = response.data;
    //     console.log("get the next most relevant match");
    //     recs.push(res.podcast)
    //     setRecs(recs);
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log(error.response);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     }
    //   });
  }

  function handleClickRelevant() {
    console.log(podcast)
    console.log(podcast["name"])
    // axios({
    //   method: "POST",
    //   url: "http://4300showcase.infosci.cornell.edu:4546/api/feedback/",
    //   data: JSON.stringify({
    //     podcast: podcast["name"],
    //     relevant: true,
    //   }),
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => {
    //     const res = response.data;
    //     console.log("Clicked like button");
    //     console.log(res)

    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log(error.response);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     }
    //   });

  };

  function handleClickIrrelevant() {
    // axios({
    //   method: "POST",
    //   url: "http://4300showcase.infosci.cornell.edu:4546/api/feedback/",
    //   data: JSON.stringify({
    //     podcast: podcast["name"],
    //     relevant: false,
    //   }),
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => {
    //     const res = response.data;
    //     console.log("Clicked the dislike button");
    //     console.log(res)
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log(error.response);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     }
    //   });

    // handlePodcastDelete();

  };

  return (

    <div class="rating">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <div class="like grow" >
        <i class="fa fa-thumbs-up fa-3x like" aria-hidden="true" onClick={handleClickRelevant}></i>
      </div>
      <div class="dislike grow">
        <i class="fa fa-thumbs-down fa-3x like" aria-hidden="true" onClick={handleClickIrrelevant}></i>
      </div>
    </div>
  )
}

export default Likedislike