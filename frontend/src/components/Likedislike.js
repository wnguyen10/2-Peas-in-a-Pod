import React, { useState } from "react";
import "./Likedislike.css";

function Likedislike({ podcast }) {
  // state = {
  //   color: 'red'
  // }
  function handleClickRelevant() {
    // axios({
    //   method: "POST",
    //   url: "http://4300showcase.infosci.cornell.edu:4546/api/feedback/",
    //   // url: "api/recommendations",
    //   data: JSON.stringify({
    //     "user1": user1Publishers,
    //     "user2": user2Publishers
    //   }),
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .then((response) => {
    //     const res = response.data;
    //     console.log("fetched recs");
    //     console.log(res)
    //     setRecs(res.recommendations);

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
    console.log(podcast)

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