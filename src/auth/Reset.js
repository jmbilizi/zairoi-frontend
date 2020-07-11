import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Reset = ({ match }) => {
  // props.match from react router dom
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    error: "",
    success: "",
    buttonText: "Reset password",
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    // console.log(name);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token, newPassword, error, success, buttonText } = values;

  const handleChange = (event) => {
    setValues({
      ...values,
      error: "",
      success: "",
      newPassword: event.target.value,
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then((response) => {
        console.log("RESET PASSWORD SUCCESS", response);
        toast.success(response.data.message);
        setValues({
          ...values,
          success: response.data.message,
          buttonText: "Done",
        });
      })
      .catch((error) => {
        console.log("RESET PASSWORD ERROR", error.response.data);
        toast.error(error.response.data.error);
        setValues({
          ...values,
          error: error.response.data.error,
          buttonText: "Reset password",
        });
      });
  };

  const passwordResetForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">New password</label>
        <input
          onChange={handleChange}
          value={newPassword}
          type="password"
          className="form-control"
          placeholder="Type your new password here"
          required
        />
      </div>

      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Hey {name}, Type your new password</h1>
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
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export default Reset;
