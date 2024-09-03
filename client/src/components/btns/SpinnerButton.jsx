import React from "react";

export default function SpinnerButton({ isLoading, children, ...props }) {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={`btn ${isLoading ? "opacity-70" : ""}`}
    >
      {isLoading ? <span className="spinner-border"></span> : children}
    </button>
  );
}
