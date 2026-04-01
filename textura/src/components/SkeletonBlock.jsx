import React from "react";

const SkeletonBlock = ({ height = 16, width = "100%" }) => (
  <div
    style={{
      height,
      width,
      borderRadius: 8,
      background:
        "linear-gradient(90deg, rgba(226,232,240,.8) 25%, rgba(241,245,249,1) 37%, rgba(226,232,240,.8) 63%)",
      backgroundSize: "400% 100%",
      animation: "shimmer 1.4s ease infinite",
    }}
  />
);

export default SkeletonBlock;
