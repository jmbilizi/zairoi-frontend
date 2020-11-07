import React, { useState, useEffect } from "react";
import { isAuth, getCookie } from "../auth/helpers";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";

const ManageProducts = () => {
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

  const destroy = async (productName, productId) => {
    let answer = await window.confirm(
      `Are you sure you want to delete the product "${productName}"?`
    );
    if (answer) {
      deleteProduct(productId, user._id, token).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          loadProducts();
        }
      });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <h2 className="text-center">All {products.length} products</h2>
      <br />
      <div>
        {products.map((p, i) => (
          <div key={i}>
            <div style={{ height: "40px" }} className="row bg-light mb-1 px-3">
              <div style={{ color: "dark" }} className="col-9 mx-auto my-auto">
                {p.name}
              </div>

              <div className="col-1  my-auto">
                <Link to={`/user/${p.soldBy}`}>
                  <span
                    style={{ color: "blue" }}
                    data-toggle="tooltip"
                    data-placement="left"
                    title="View Seller's profile"
                    className="far fa-user"
                  ></span>
                </Link>
              </div>

              <div className="col-1  my-auto">
                <Link to={`/admin/product/update/${p._id}`}>
                  <span
                    style={{ color: "orange" }}
                    data-toggle="tooltip"
                    data-placement="left"
                    title="Edit product"
                    className="fas fa-edit"
                  ></span>
                </Link>
              </div>

              <div
                style={{ color: "red" }}
                onClick={() => destroy(p.name, p._id)}
                data-toggle="tooltip"
                data-placement="left"
                title="Delete product"
                className="col-1 fas fa-trash-alt text-center my-auto"
              ></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManageProducts;
