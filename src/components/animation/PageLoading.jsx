import React from "react";

const PageLoading = () => {
  return (
    <div className="w-full h-screen bg-zinc-500 dark:bg-flat-black">
      <div className="loading-window ">
        <div className="car">
          <div className="strike"></div>
          <div className="strike strike2"></div>
          <div className="strike strike3"></div>
          <div className="strike strike4"></div>
          <div className="strike strike5"></div>
          <div className="car-detail spoiler"></div>
          <div className="car-detail back"></div>
          <div className="car-detail center"></div>
          <div className="car-detail center1"></div>
          <div className="car-detail front"></div>
          <div className="car-detail wheel"></div>
          <div className="car-detail wheel wheel2"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
