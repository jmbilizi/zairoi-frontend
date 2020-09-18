import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

const NewProfileTab = ({ user, following, followers, posts }) => {

  console.log(posts);
  
  const profileNav = () => (
    <ul
      style={{
        listStyleType: "none",
        opacity: "100%",
        margin: "0",
        background: "",
      }}
      className="navbar nav-tabs"
    >
      <li className="nav-item">
        <Link to={`/user/${user._id}`} className="nav-link">
          {`${posts.length}            `}
          <i
            className="fab fa-usps"
            style={{
              fontSize: "25px",
              position: "relative",
              height: "50px",
            }}
          >
            <span
              style={{
                position: "absolute",
                height: "20px",
                bottom: "0",
                right: "0",
                left: "0",
                fontSize: "20px",
                width: "200px",
              }}
            >
              <small>Posts</small>
            </span>
          </i>
        </Link>
      </li>
      <li className="nav-item">
        <Link to={`/user/${user._id}/followers`} className="nav-link">
          {`${followers.length}           `}
          <i
            className="fas fa-user-friends"
            style={{
              fontSize: "25px",
              position: "relative",
              height: "50px",
            }}
          >
            <span
              style={{
                position: "absolute",
                height: "20px",
                bottom: "0",
                right: "0",
                left: "0",
                fontSize: "20px",
              }}
            >
              <small>lowers</small>
            </span>
          </i>
        </Link>
      </li>
      <li className="nav-item">
        <Link to={`/user/${user._id}/following`} className="nav-link">
          {`${following.length}              `}
          <i
            className="fas fa-user-friends"
            style={{
              fontSize: "25px",
              position: "relative",
              height: "50px",
            }}
          >
            <span
              style={{
                position: "absolute",
                height: "20px",
                bottom: "0",
                right: "0",
                left: "0",
                fontSize: "20px",
              }}
            >
              <small>lowing</small>
            </span>
          </i>
        </Link>
      </li>
    </ul>
  );

  return (
    <Fragment>
      {profileNav()}
      <div style={{ marginTop: "20px" }} className="container">
        <div className="row">
          <div className="col-sm-12">
            {posts.map((post, i) => (
              <div key={i}>
                <div>
                  <Link to={`/post/${post._id}`}>
                    <div>
                      <p className="lead text-center">{post.title}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProfileTab;
