import React, { useState, useEffect } from "react";
import useFetchData from "../../hooks/UseFetchData";
import "./DataList.css";
import Loading from "../Loading/Loading";

function DataList({ searchQuery, activeFilter }) {
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState({});
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { data, loading, hasMore } = useFetchData(
    "https://api.spacexdata.com/v3/launches",
    page,
    searchQuery
  );

  useEffect(() => {
    if (data.length) {
      setAllData((prevData) => [...prevData, ...data]);
    }
  }, [data]);

  useEffect(() => {
    const filtered = allData.filter((item) => {
      const matchesSearchQuery = item.mission_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "success"
          ? item.launch_success && !item.upcoming
          : activeFilter === "failed"
          ? !item.launch_success && !item.upcoming
          : activeFilter === "upcoming"
          ? item.upcoming
          : true;

      return matchesSearchQuery && matchesFilter;
    });

    const uniqueFiltered = filtered.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.mission_name === item.mission_name)
    );

    setFilteredData(uniqueFiltered);
  }, [allData, searchQuery, activeFilter]);

  useEffect(() => {
    setPage(1);
    setVisibleItems({});
  }, [searchQuery, activeFilter]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const calculateYearsAgo = (date) => {
    const launchDate = new Date(date);
    const currentDate = new Date();
    const yearsAgo = currentDate.getFullYear() - launchDate.getFullYear();
    return yearsAgo > 0 ? `${yearsAgo} years ago` : "This year";
  };

  const toggleVisibility = (index) => {
    setVisibleItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getStatusClass = (launchSuccess, upcoming) => {
    if (upcoming) return "upcoming";
    return launchSuccess ? "success" : "failed";
  };

  const getStatusLabel = (launchSuccess, upcoming) => {
    if (upcoming) return "Upcoming";
    return launchSuccess ? "Success" : "Failed";
  };

  return (
    <div className="data-list" onScroll={handleScroll}>
      {filteredData.map((item, index) => (
        <div className="card" key={index}>
          <div className="card-header">
            <div className="header-info">
              <h3 className="mission-name">{item.mission_name}</h3>
              <span
                className={`status ${getStatusClass(
                  item.launch_success,
                  item.upcoming
                )}`}
              >
                {getStatusLabel(item.launch_success, item.upcoming)}
              </span>
            </div>
          </div>
          {visibleItems[index] && (
            <div className="card-extra">
              <div className="header-links">
                <span className="years-ago">
                  {calculateYearsAgo(item.launch_date_utc)}
                </span>
                <span className="separator">|</span>
                <a
                  href={item.links.article_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Article
                </a>
                <span className="separator">|</span>
                <a
                  href={item.links.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Video
                </a>
              </div>
              <div className="card-content">
                <img
                  className="mission-patch"
                  src={item.links.mission_patch_small || ""}
                  alt={`${item.mission_name} patch`}
                />
                <div className="details">
                  <p>{item.details || "No details available"}</p>
                </div>
              </div>
            </div>
          )}
          <button
            className="toggle-btn"
            onClick={() => toggleVisibility(index)}
          >
            {visibleItems[index] ? "Hide" : "View"}
          </button>
        </div>
      ))}
      {loading && <Loading />}
      {!hasMore && <div className="no-more-data">No more data</div>}
    </div>
  );
}

export default DataList;
