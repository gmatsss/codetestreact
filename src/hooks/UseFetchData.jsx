import { useState, useEffect } from "react";

function useFetchData(url, page, searchQuery) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${url}?limit=100&offset=${(page - 1) * 10}`
        );
        const result = await response.json();

        if (!cancel) {
          const randomizedData = randomizeAndLimit(result);
          setData((prev) => [...prev, ...randomizedData]);
          setHasMore(result.length > 0);
        }
      } catch (error) {
        if (!cancel) setHasMore(false);
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, [url, page]);

  const randomizeAndLimit = (data) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    const statuses = ["success", "failed", "upcoming"];

    const filteredStatuses = statuses.map((status) => {
      return shuffled.find((item) => {
        if (status === "success") return item.launch_success;
        if (status === "failed") return !item.launch_success;
        if (status === "upcoming") return item.upcoming;
        return false;
      });
    });

    const uniqueFilteredStatuses = filteredStatuses.filter(Boolean);
    const remaining = shuffled.filter(
      (item) =>
        !uniqueFilteredStatuses.some(
          (u) => u.mission_name === item.mission_name
        )
    );

    return [
      ...uniqueFilteredStatuses,
      ...remaining.slice(0, 10 - uniqueFilteredStatuses.length),
    ];
  };

  return { data, loading, hasMore };
}

export default useFetchData;
