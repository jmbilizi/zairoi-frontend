import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { authenticate, isAuth } from "./helpers";
import Google from "./Google";
import Facebook from "./Facebook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Signup = ({ history }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
    error: "",
    success: "",
  });

  const { name, email, password, buttonText, error, success } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value);
    setValues({
      ...values,
      error: "",
      success: "",
      [name]: event.target.value,
    });
  };

  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/private");
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log("SIGNUP SUCCESS", response);
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
          success: response.data.message,
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("SIGNUP ERROR", error.response.data);
        setValues({
          ...values,
          buttonText: "Submit",
          error: error.response.data.error,
        });
        toast.error(error.response.data.error);
      });
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
          className="form-control"
        />
      </div>

      <div>
        <button
          className="btn btn-primary btn-lg btn-block"
          onClick={clickSubmit}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="pb-3 pt-5 text-center">SIGN UP</h1>
        <div
          className="alert alert-danger text-center"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        <div
          className="alert alert-success text-center"
          style={{ display: success ? "" : "none" }}
        >
          {success}
        </div>
        {signupForm()}
        <Link
          to="/auth/password/forgot"
          className="btn btn-lg btn-block btn-outline-danger mb-3 mt-3"
        >
          Forgot Password
        </Link>
        <Google informParent={informParent} />
        <Facebook informParent={informParent} />
      </div>
    </Layout>
  );
};

export default Signup;
