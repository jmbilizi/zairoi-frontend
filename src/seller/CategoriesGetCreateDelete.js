import React, { useState, useEffect } from "react";
import { isAuth, getCookie } from "../auth/helpers";
import { getCategories, deleteCategory, createCategory } from "./apiAdmin";
import { Link } from "react-router-dom";

const user = isAuth();
const token = getCookie("token");

const CategoriesGetCreateDelete = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

//add category code
  const handleChange = (e) => {
    setError("");
    setName(e.target.value);
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    // make request to api to create category
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setError("");
        setSuccess(true);
        loadCategories();
      }
    });
  };
  const newCategoryFom = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control text-center"
          onChange={handleChange}
          value={name}
          autoFocus
          required
        />
      </div>
      <button className="btn btn-raised btn-info rounded-pill">
        Create Category
      </button>
    </form>
  );

  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">{name} is created</h3>;
    }
  };

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Category should be unique</h3>;
    }
  };

//view category code
  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };
  useEffect(() => {
    loadCategories();
  }, []);

//delete category code
  const destroy = async (categoryName, categoryId) => {
    let answer = await window.confirm(
      `Are you sure you want to delete the category "${categoryName}"?`
    );
    if (answer) {
      deleteCategory(categoryId, user._id, token).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          loadCategories();
        }
      });
    }
  };

  return (
    <>
      <div className="row text-center mb-3">
        <div className="col-md-8 offset-md-2">
          <h3>Add a new category</h3>
          {showSuccess()}
          {showError()}
          {newCategoryFom()}
        </div>
      </div>
      <h3 className="text-center">All {categories.length} Categories</h3>
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

export default CategoriesGetCreateDelete;
