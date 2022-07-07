import React from "react";

export const PriceWrapper = ({ price }) => {
  return (
    <span className="w-s-n">
      <strong>{(price || 0).toLocaleString("ru")}</strong> сум
    </span>
  );
};
