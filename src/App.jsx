import React, { useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import DataList from "./components/DataList/DataList";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="App">
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />
      <DataList searchQuery={searchQuery} activeFilter={activeFilter} />
    </div>
  );
}

export default App;
