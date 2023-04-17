import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForkRef } from "@mui/material";

function SearchBar({ placeholder, data, addItem, setPhrases, isAdvanced }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleChange = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);

    if (isAdvanced) {
      const newFilter = data.filter((value) => {
        return value.name.toLowerCase().includes(searchWord.toLowerCase());
      });

      if (searchWord === "") {
        setFilteredData([]);
      } else {
        setFilteredData(newFilter);
      }
    } else {
      setPhrases([event.target.value]);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      {isAdvanced && (
        <>
          <div className="searchInputs">
            <input
              type="text"
              placeholder={placeholder}
              value={wordEntered}
              onChange={handleChange}
            />
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
                  <button
                    className="dataItem"
                    key={key}
                    onClick={() => {
                      clearInput();
                      addItem(value.name);
                    }}
                  >
                    <div>{value.name}</div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* simple search */}
      {!isAdvanced && (
        <>
          <div className="searchInputs">
            <input
              type="text"
              placeholder={placeholder}
              value={wordEntered}
              onChange={handleChange}
            />
            <div className="searchIcon">
              {wordEntered.length === 0 ? (
                <SearchIcon />
              ) : (
                <CloseIcon id="clearBtn" onClick={clearInput} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SearchBar;
