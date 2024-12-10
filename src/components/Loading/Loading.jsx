import React from "react";
import { Puff } from "react-loader-spinner";
import "./Loading.css";

function Loading() {
  return (
    <div className="loading-container">
      <Puff
        visible={true}
        height="50"
        width="50"
        color="#007bff"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default Loading;
