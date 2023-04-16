import React, { useState, useEffect } from "react";
import Results from "../components/Results";
import User from "../components/User";
import "./Home.css";
import logo from "../data/logo.png";
import axios from "axios";
import Podcast from "../components/Podcast";
import { FormControlLabel, Switch, ToggleButton } from "@mui/material";

function Home() {
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [pubData, setPubData] = useState([]);
  const [recs, setRecs] = useState([]);
  const [user1Publishers, setUser1Publishers] = useState([]);
  const [user2Publishers, setUser2Publishers] = useState([]);

  useEffect(() => {
    getPublishers();
    // getPodcasts();
  }, []);

  function getPodcasts() {
    axios({
      method: "GET",
      url: "/api/podcasts",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    });
  }

  function getPublishers() {
    axios({
      method: "GET",
      url: "http://4300showcase.infosci.cornell.edu:4546/api/publishers",
    })
      .then((response) => {
        const res = response.data;
        console.log("fetched publishers");
        setPubData(res.publishers);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function getMatches() {
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // var raw = JSON.stringify({
    //   "user1": user1Publishers,
    //   "user2": user2Publishers
    // });

    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow'
    // };

    // fetch("api/recommendations/", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));

    axios({
      method: "POST",
      url: "http://4300showcase.infosci.cornell.edu:4546/api/recommendations/",
      // url: "api/recommendations",
      data: JSON.stringify({
        user1: user1Publishers,
        user2: user2Publishers,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const res = response.data;
        console.log("fetched recs");
        console.log(res);
        setRecs(res.recommendations);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function handleChange(event) {
    console.log(event);
    setAdvancedSearch(!advancedSearch);
  }

  return (
    <div className="Home">
      <div className="Title">
        <img src={logo} width="400" height="300" />
        <text> TWO PEAS IN A POD</text>
      </div>
      <div>
        {" "}
        <p> Input your favorite stations and find your perfect blend:</p>
      </div>
      <div className="Users">
        <User
          num={1}
          pubData={pubData}
          publishers={user1Publishers}
          setPublishers={setUser1Publishers}
          advanced={advancedSearch}
        />
        <User
          num={2}
          pubData={pubData}
          publishers={user2Publishers}
          setPublishers={setUser2Publishers}
          advanced={advancedSearch}
        />
      </div>

      <FormControlLabel
        control={<Switch />}
        label="Advanced search"
        labelPlacement="start"
        onChange={handleChange}
      />
      <div className="match-button">
        <button type="button" onClick={getMatches}>
          Find Matches!
        </button>
      </div>
      <div>
        {typeof recs !== undefined &&
          recs.length !== 0 &&
          recs.map((podcast, key) => {
            return (
              <div className="recommendations" key={key}>
                <Podcast podcast={podcast} num={key + 1} />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Home;
