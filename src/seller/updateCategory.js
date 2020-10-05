import React, { useState, useEffect } from "react";
import { isAuth, getCookie } from "../auth/helpers";
import Layout from "../core/Layout";
import { Link, Redirect } from "react-router-dom";
import { getCategory, updateCategory } from "./apiAdmin";

const UpdateCategory = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    error: "",
    redirectToProfile: false,
    formData: "",
  });

  // destructure user and token from localStorage
  // const { user, token } = isAuth();
  const user = isAuth();
  const token = getCookie("token");

  const { name, error, redirectToProfile } = values;

  const init = (categoryId) => {
    getCategory(categoryId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // populate the state
        console.log(data);
        setValues({
          ...values,
          name: data.name,
        });
      }
    });
  };

  useEffect(() => {
    init(match.params.categoryId);
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const submitCategoryForm = (e) => {
    e.preventDefault();
    // update with ? you should send category name otherwise what to update?
    const category = {
      name: name,
    };
    updateCategory(match.params.categoryId, user._id, token, category).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: data.name,
            error: false,
            redirectToProfile: true,
          });
        }
      }
    );
  };

  const updateCategoryForm = () => (
    <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
      <form className="mb-5" onSubmit={submitCategoryForm}>
        <h2 className="login100-form-title p-b-32 m-b-7">
          Update Category Form
        </h2>
        <span className="txt1 p-b-11">{name}</span>
        <br />
        <br />
        <div className="validate-input">
          <input
            onChange={handleChange("name")}
            value={name}
            style={{ width: "100%" }}
            className="rounded-pill text-center"
            type="text"
            required
            name="name"
          />
        </div>
        <br />
        <div className="w-size25">
          <button
            type="submit"
            className="btn btn-raised btn-info rounded-pill"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );

  const showError = () => (
    <div
      className={"alert alert-danger"}
      role="alert"
      style={{ display: error ? "" : "none" }}
    >
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      {error}
    </div>
  );

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect to="/admin" />;
      }
    }
  };

  const goBackBTN = () => {
    return (
      <div className="mt-5">
        <Link to="/admin" className="text-info">
          Back To Admin Home
        </Link>
      </div>
    );
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-12 text-center ">
          {showError()}
          {updateCategoryForm()}
          {goBackBTN()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateCategory;
