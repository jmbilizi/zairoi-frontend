import React from "react";
import { API } from "../config";

const ShowImage = ({ item, url }) => (
  <div className="product-img">
    <img
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      className="mb-3 mx-auto"
      style={{ height: "200px", width: "auto" }}
    />
  </div>
);

export default ShowImage;
