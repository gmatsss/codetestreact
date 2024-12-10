import React from "react";
import "./SearchBar.css";

function SearchBar({ onSearch, onFilterChange, activeFilter }) {
  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };

  const handleFilterClick = (filter) => {
    if (activeFilter === filter) {
      onFilterChange("");
    } else {
      onFilterChange(filter);
    }
  };

  return (
    <div className="search-bar">
      <input type="text" placeholder="Search..." onChange={handleInputChange} />
      <p className="filter-tags">
        <span
          className={activeFilter === "success" ? "active" : ""}
          onClick={() => handleFilterClick("success")}
        >
          Success
        </span>
        <span
          className={activeFilter === "failed" ? "active" : ""}
          onClick={() => handleFilterClick("failed")}
        >
          Failed
        </span>
        <span
          className={activeFilter === "upcoming" ? "active" : ""}
          onClick={() => handleFilterClick("upcoming")}
        >
          Upcoming
        </span>
      </p>
    </div>
  );
}

export default SearchBar;
