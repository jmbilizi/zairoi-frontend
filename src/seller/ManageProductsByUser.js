import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuth, getCookie } from "../auth/helpers";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";

const ManageProducts = ({ userId }) => {
  const [products, setProducts] = useState([]);

  // const { user, token } = isAuth();
  const user = isAuth();
  const token = getCookie("token");

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  const destroy = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="col-12">
      <h2 className="text-center">My products</h2>
      {products
        .filter((p) => p.soldBy === userId)
        .map((p, i) => (
          <>
            <ul className="list-group">
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{p.name}</strong>
                <Link to={`/admin/product/update/${p._id}`}>
                  <span className="badge badge-warning badge-pill">Update</span>
                </Link>
                <span
                  onClick={() => destroy(p._id)}
                  className="badge badge-danger badge-pill"
                >
                  Delete
                </span>
              </li>
            </ul>
          </>
        ))}
      <br />
    </div>
  );
};

export default ManageProducts;
