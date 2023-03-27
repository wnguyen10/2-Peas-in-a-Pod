import React, { useState, useEffect } from "react";
import "./SearchBar.css"
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useForkRef } from "@mui/material";

function SearchBar({ placeholder, pubData, addPublisher }) {

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");


  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = pubData.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input type="text" placeholder={placeholder} value={wordEntered} onChange={handleFilter} />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>

      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <button className="dataItem" key={key} onClick={() => { clearInput(); addPublisher(value.name) }}>
                <p>{value.name} </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
