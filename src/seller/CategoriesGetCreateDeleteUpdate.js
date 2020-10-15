import React, { useState, useEffect } from "react";
import { isAuth, getCookie } from "../auth/helpers";
import {
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
} from "./apiAdmin";

const user = isAuth();
const token = getCookie("token");

const CategoriesGetCreateDelete = () => {
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState();
  const [catName, setCatName] = useState();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [update, setUpdate] = useState(false);

  //add category code
  const handleChange = (e) => {
    setError("");
    setName(e.target.value);
    setCatName(e.target.value);
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
        setSuccess(true);
        setError("");
        loadCategories();
        setTimeout(() => {
          setSuccess(false);
          setName("");
        }, 1000);
      }
    });
  };
  const newCategoryFom = (theValue, submitFunction) => (
    <form onSubmit={submitFunction}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control text-center"
          onChange={handleChange}
          value={theValue}
          autoFocus
          required
        />
      </div>
      <button className="btn btn-raised btn-info rounded-pill">
        {!update ? <>Create Category</> : <>Save Changes</>}
      </button>
      {update ? (
        <button
          onClick={() => {
            setUpdate(false);
            setSuccess(false);
            setError(false);
          }}
          className="btn btn-raised btn-info rounded-pill ml-1"
        >
          Back to add
        </button>
      ) : (
        ""
      )}
    </form>
  );

  const showSuccess = () => {
    if (success) {
      return (
        <h3 className="text-success">
          {!update ? <>{name} is created</> : <>Updated</>}
        </h3>
      );
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

  //Update category
  const submitCategoryFormUpdate = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    let cat = {
      name: catName,
    };
    if (update) {
      updateCategory(catId, user._id, token, cat).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setError("");
          setName("");
          setUpdate(true);
          setSuccess(true);
          loadCategories();
          setTimeout(() => {
            setSuccess(false);
          }, 1000);
        }
      });
    }
  };
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
          {!update ? (
            <h3>Add a new category</h3>
          ) : (
            <h3>Update Category Form</h3>
          )}
          {showSuccess()}
          {showError()}
          {newCategoryFom.apply(
            this,
            !update ? [name, clickSubmit] : [catName, submitCategoryFormUpdate]
          )}
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
                <span
                  style={{ color: "orange" }}
                  onClick={() => {
                    setUpdate(true);
                    setCatId(category._id);
                    setCatName(category.name);
                  }}
                  className="fas fa-edit"
                ></span>
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
