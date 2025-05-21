import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./style.scss";

const SkeletonLoader = ({ itemCount = 4, height = 100, width = 100 }) => {
  const skeletonItems = Array.from({ length: itemCount });

  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#e6e6e6">
      <div
        className="skeleton-loader-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "10px",
        }}
      >
        {skeletonItems.map((_, index) => (
          <Skeleton key={index} height={height} width={width} />
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonLoader;
