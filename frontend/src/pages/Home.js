import React, { useState, useEffect } from "react";
import Results from "../components/Results";
import User from "../components/User";
import "./Home.css";
import logo from "../data/logo.png";
import axios from "axios";
import Podcast from "../components/Podcast";
import Likedislike from "../components/Likedislike";
import { FormControlLabel, Switch, ToggleButton } from "@mui/material";

function Home() {
  const [recs, setRecs] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [fetched, setFetched] = useState(false);

  const [pubData, setPubData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [podcastData, setPodcastData] = useState([]);
  const [user1Publishers, setUser1Publishers] = useState([]);
  const [user2Publishers, setUser2Publishers] = useState([]);
  const [user1Genres, setUser1Genres] = useState([]);
  const [user2Genres, setUser2Genres] = useState([]);
  const [user1Podcasts, setUser1Podcasts] = useState([]);
  const [user2Podcasts, setUser2Podcasts] = useState([]);
  const [user1min, setUser1Min] = useState(0);
  const [user1max, setUser1Max] = useState(60);
  const [user2min, setUser2Min] = useState(0);
  const [user2max, setUser2Max] = useState(60);

  const [user1Phrases, setUser1Phrases] = useState([]);
  const [user2Phrases, setUser2Phrases] = useState([]);

  const [isRelevantActive, setIsRelevantActive] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isIrrelevantActive, setIsIrrelevantActive] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    getPublishers();
    getPodcasts();
    getGenres();
  }, []);

  function getPodcasts() {
    axios({
      method: "GET",
      url: "http://4300showcase.infosci.cornell.edu:4546/api/podcasts",
    })
      .then((response) => {
        const res = response.data;
        console.log("fetched podcasts");
        setPodcastData(res.podcasts);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        getPodcasts();
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
        getPublishers();
      });
  }

  function getGenres() {
    axios({
      method: "GET",
      url: "http://4300showcase.infosci.cornell.edu:4546/api/genres",
    })
      .then((response) => {
        const res = response.data;
        console.log("fetched genres");
        setGenreData(res.categories);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        getGenres();
      });
  }

  function getMatches() {
    setIsRelevantActive([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    axios({
      method: "POST",
      url: "http://4300showcase.infosci.cornell.edu:4546/api/recommendations/",
      data: JSON.stringify({
        user1: {
          genres: user1Genres,
          publishers: user1Publishers,
          phrases: user1Phrases,
          podcasts: user1Podcasts,
          duration: [user1min, user1max],
        },
        user2: {
          genres: user2Genres,
          publishers: user2Publishers,
          phrases: user2Phrases,
          podcasts: user2Podcasts,
          duration: [user2min, user2max],
        },
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
        setFetched(true);
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
    setAdvancedSearch(!advancedSearch);
    setUser1Publishers([]);
    setUser2Publishers([]);
    setUser1Genres([]);
    setUser2Genres([]);
    setUser1Podcasts([]);
    setUser2Podcasts([]);
    setUser1Phrases([]);
    setUser2Phrases([]);
    setFetched(false);
  }

  return (
    <div className="Home">
      <div className="Title">
        <img src={logo} width="400" height="300" />
        <text> TWO PEAS IN A POD</text>
      </div>
      <div>
        {" "}
        <p> Let us find your perfect blend:</p>
      </div>
      <div className="Users">
        <User
          num={1}
          pubData={pubData}
          publisherPrefs={user1Publishers}
          setPublisherPrefs={setUser1Publishers}
          genreData={genreData}
          genrePrefs={user1Genres}
          setGenrePrefs={setUser1Genres}
          podcastData={podcastData}
          podcastPrefs={user1Podcasts}
          setPodcastPrefs={setUser1Podcasts}
          min={user1min}
          setMin={setUser1Min}
          max={user1max}
          setMax={setUser1Max}
          setPhrases={setUser1Phrases}
          isAdvanced={advancedSearch}
        />
        <User
          num={2}
          pubData={pubData}
          publisherPrefs={user2Publishers}
          setPublisherPrefs={setUser2Publishers}
          genreData={genreData}
          genrePrefs={user2Genres}
          setGenrePrefs={setUser2Genres}
          podcastData={podcastData}
          podcastPrefs={user2Podcasts}
          setPodcastPrefs={setUser2Podcasts}
          min={user2min}
          setMin={setUser2Min}
          max={user2max}
          setMax={setUser2Max}
          setPhrases={setUser2Phrases}
          isAdvanced={advancedSearch}
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

      {typeof recs !== undefined && recs.length !== 0 && (
        <div className="disclaimer">
          <p>
            NOTE: The displayed percentage is based on the cosine similarity of
            the averaged user inputs and the transcripts of the recommended
            podcasts. To represent the combined user inputs, we generate a
            term-frequency vector representing both user’s inputted preferences,
            which is further condensed into a lower-dimensional space by
            singular value decomposition.
          </p>
        </div>
      )}

      <div>
        {typeof recs !== undefined &&
          recs.length !== 0 &&
          recs.map((podcast, key) => {
            return (
              <div className="recommendations">
                <div className="column">
                  <div className="result" key={key}>
                    <Podcast podcast={podcast} num={key + 1} />
                  </div>
                </div>
                <div className="column">
                  <div class="rating">
                    <Likedislike
                      user1={{
                        genres: user1Genres,
                        publishers: user1Publishers,
                        phrases: user1Phrases,
                        podcasts: user1Podcasts,
                        duration: [user1min, user1max],
                      }}
                      user2={{
                        genres: user2Genres,
                        publishers: user2Publishers,
                        phrases: user2Phrases,
                        podcasts: user2Podcasts,
                        duration: [user2min, user2max],
                      }}
                      podcast={podcast}
                      recs={recs}
                      setRecs={setRecs}
                      num={key}
                      isRelevantActive={isRelevantActive}
                      setIsRelevantActive={setIsRelevantActive}
                      isIrrelevantActive={isIrrelevantActive}
                      setIsIrrelevantActive={setIsIrrelevantActive}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        {fetched && recs.length === 0 && (
          <div className="no-results">No results</div>
        )}
      </div>
    </div>
  );
}

export default Home;
