import React from "react";
import { API } from "../config";

const ShowImage = ({ p }) => (
  <div className="product-img">
    <img
      src={p.photo && p.photo.url}
      alt={p.name}
      className="mb-3 mx-auto"
      style={{ height: "200px", width: "100%" }}
    />
  </div>
);

export default ShowImage;
