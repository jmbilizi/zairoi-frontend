import React from "react";

const ShowImage = ({ p }) => (
  <div className="card m-0">
    <img
      src={p.photo && p.photo.url}
      alt={p.name}
      className="card-img mx-auto"
      style={{ height: "200px", width: "100%" }}
    />
    <div className="card-img-overlay d-flex justify-content-end">
      <a href="#" className="card-link text-danger like">
        <i class="fas fa-heart fa-2x"></i>
      </a>
    </div>
  </div>
);

export default ShowImage;
