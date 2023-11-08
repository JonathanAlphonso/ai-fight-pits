// src/components/LoadingSpinner.tsx
import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{ overflow: "hidden" }}>
      <ClipLoader
        cssOverride={{ overflow: "hidden", height: 250, width: 250 }}
        color={"#ffffff"}
        size={250}
      />
    </div>
  );
};

export default LoadingSpinner;