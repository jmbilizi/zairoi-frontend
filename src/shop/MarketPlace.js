import React, { useState, useEffect } from "react";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  const loadProductsBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data.error) {
        console.log(data.error);
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-12">
          <Search />
          <h2 className="mb-4">New Arrivals</h2>
          <div className="row">
            {productsByArrival.map((product, i) => (
              <div key={i} className="col-md-4 col-sm-12 mb-3">
                <Card product={product} />
              </div>
            ))}
          </div>

          <h2 className="mb-4">Best Sellers</h2>
          <div className="row">
            {productsBySell.map((product, i) => (
              <div key={i} className="col-lg-4 col-md-6 col-sm-12 mb-1">
                <Card product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
