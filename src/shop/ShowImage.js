import React from "react";
import { Carousel } from "react-bootstrap";

const ShowImage = ({ p }) => (
  <Carousel interval={null}>
    {p.photo.map((v, i) => (
      <Carousel.Item>
        <img
          src={v && v.url}
          alt={v.name}
          className="card-img mx-auto"
          style={{ height: "250px", width: "100%" }}
        />
        <div className="card-img-overlay d-flex justify-content-end">
          <a href="#" className="card-link text-danger like">
            <i className="fas fa-heart fa-2x"></i>
          </a>
        </div>
      </Carousel.Item>
    ))}
  </Carousel>
);

export default ShowImage;
