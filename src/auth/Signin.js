import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { authenticate, isAuth } from "./helpers";
import { ToastContainer, toast } from "react-toastify";
import Google from "./Google";
import Facebook from "./Facebook";
import "react-toastify/dist/ReactToastify.min.css";

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    buttonText: "Submit",
  });

  const { email, password, error, buttonText } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value);
    setValues({ ...values, error: "", [name]: event.target.value });
  };

  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push(`/user/${isAuth()._id}`);
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/signin`,
      data: { email, password },
    })
      .then((response) => {
        console.log("SIGNIN SUCCESS", response);
        // save the response (user, token) localstorage/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            buttonText: "Submitted",
          });
          // toast.success(`Hey ${response.data.user.name}, Welcome back!`);
          isAuth() && isAuth().role === "admin"
            ? history.push("/admin")
            : history.push(`/user/${isAuth()._id}`);
        });
      })
      .catch((error) => {
        console.log("SIGNIN ERROR", error.response.data);
        setValues({
          ...values,
          buttonText: "Submit",
          error: error.response.data.error,
        });
        toast.error(error.response.data.error);
      });
  };

  const signinForm = () => (
    <form>
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
      <div
        style={{ border: "", background: "white" }}
        className="col-md-6 my-auto offset-md-3 px-5 py-5"
      >
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="pb-3 text-center">Sign In</h1>
        <div
          className="alert alert-danger text-center"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        {signinForm()}

        <Link
          to="/auth/password/forgot"
          className="btn btn-lg btn-block btn-outline-danger mb-3 mt-3"
        >
          Forgot Password
        </Link>
        <Link
          to="/signup"
          className="btn btn-primary btn-lg btn-block mb-3 mt-3"
        >
          Sign Up
        </Link>
        <Google informParent={informParent} />
        <Facebook informParent={informParent} />
        <small>
          By clicking Sign in or Login with Google or Facebook, you
          agree to Tokoos's Terms of Use and Privacy Policy. Tokoos may
          communicate with you via email. We'll never post without your permission.
        </small>
      </div>
    </Layout>
  );
};

export default Signin;
