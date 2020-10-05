import React, { useState, useEffect } from "react";
import { isAuth, getCookie } from "../auth/helpers";
import { getCategories, deleteCategory } from "./apiAdmin";
import { Link } from "react-router-dom";

const user = isAuth();
const token = getCookie("token");

const GetCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  }, []);

  const destroy = async (categoryName, categoryId) => {
    let answer = await window.confirm(
      `Are you sure you want to delete the category "${categoryName}"?`
    );
    if (answer) {
      deleteCategory(categoryId, user._id, token).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          window.location.reload();
        }
      });
    }
  };

  return (
    <>
      <h3 className="text-center">All Categories</h3>
      <br />
      <div>
        {categories.map((category, i) => (
          <div key={i}>
            <div style={{ height: "40px" }} className="row bg-white mb-1 px-3">
              <div style={{ color: "dark" }} className="col-10 mx-auto my-auto">
                {category.name}
              </div>

              <div className="col-1  my-auto">
                <Link to={`/admin/category/update/${category._id}`}>
                  <span
                    style={{ color: "orange" }}
                    className="fas fa-edit"
                  ></span>
                </Link>
              </div>

              <div
                style={{ color: "red" }}
                onClick={() => destroy(category.name, category._id)}
                className="col-1 fas fa-trash-alt text-center my-auto"
              ></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GetCategories;
