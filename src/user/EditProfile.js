import React, { useState, useEffect } from "react";
import { isAuth, getCookie } from "../auth/helpers";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Layout from "../core/Layout";

const EditProfile = (props) => {
  const [state, setState] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    redirectToProfile: false,
    error: "",
    fileSize: 0,
    loading: false,
    about: "",
  });

  const init = (userId) => {
    // const token = isAuth().token;
    const token = getCookie("token");
    read(userId, token).then((data) => {
      if (data.error) {
        setState({ redirectToProfile: true });
      } else {
        setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about,
        });
      }
    });
  };

  useEffect(() => {
    const userId = props.match.params.userId;
    init(userId);
  }, []);

  const isValid = () => {
    const { name, email, password, fileSize } = state;
    if (fileSize > 1000000) {
      setState({
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    if (name.length === 0) {
      setState({ error: "Name is required", loading: false });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setState({
        error: "A valid Email is required",
        loading: false,
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      setState({
        error: "Password must be at least 6 characters long",
        loading: false,
      });
      return false;
    }
    return true;
  };
  const userData = new FormData();

  const handleChange = (name) => (event) => {
    setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    userData.set(name, value);
    setState({ [name]: value, fileSize });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setState({ loading: true });

    if (isValid()) {
      const userId = this.props.match.params.userId;
      const token = getCookie("token");
      // const token = isAuth().token;

      update(userId, token, userData).then((data) => {
        if (data.error) {
          setState({ error: data.error });
        } else if (isAuth().role === "admin") {
          setState({
            redirectToProfile: true,
          });
        } else {
          updateUser(data, () => {
            setState({
              redirectToProfile: true,
            });
          });
        }
      });
    }
  };

  const signupForm = (name, email, password, about) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Profile Photo</label>
        <input
          onChange={handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          disabled
          value={email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">About</label>
        <textarea
          onChange={handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );

  const {
    id,
    name,
    email,
    password,
    redirectToProfile,
    error,
    loading,
    about,
  } = state;

  if (redirectToProfile) {
    return <Redirect to={`/user/${id}`} />;
  }

  const photoUrl = id
    ? `${
        process.env.REACT_APP_API_URL
      }/user/photo/${id}?${new Date().getTime()}`
    : DefaultProfile;

  return (
    <Layout>
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={photoUrl}
          onError={(i) => (i.target.src = `${DefaultProfile}`)}
          alt={name}
        />

        {isAuth().role === "admin" && signupForm(name, email, password, about)}

        {isAuth()._id === id && signupForm(name, email, password, about)}
      </div>
    </Layout>
  );
};

export default EditProfile;
