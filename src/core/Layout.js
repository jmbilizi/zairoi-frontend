import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../auth/helpers";
import DefaultProfile from "../images/avatar.jpg";
import { itemTotal } from "../shop/cartHelpers";
import ChatsBox from "../chat/ChatsBox";
// import { Message } from "@primer/octicons-react";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "orange" };
    } else {
      return { color: "black" };
    }
  };

  const nav = () => (
    <nav className="navbar navbar-expand-lg nav-tabs navbar-light sticky-top bg-white">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <Link to="/" className="navbar-brand">
        Sutwa
      </Link>
      <div
        style={{ lineHeight: "45px" }}
        className="collapse navbar-collapse"
        id="navbarText"
      >
        <ul style={{ listStyleType: "none" }} className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link" style={isActive("/")}>
              <i className="fas fa-house-user"></i> Home
            </Link>
          </li>
          {!isAuth() && (
            <Fragment>
              <li className="nav-item">
                <Link
                  to="/signin"
                  className="nav-link"
                  style={isActive("/signin")}
                >
                  <i className="fas fa-sign-in-alt"></i> Log In
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/signup"
                  className="nav-link"
                  style={isActive("/signup")}
                >
                  <i className="fas fa-user-plus"></i> Log Out
                </Link>
              </li>
            </Fragment>
          )}

          {isAuth() && isAuth().role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link" style={isActive("/admin")} to="/admin">
                Admin
              </Link>
            </li>
          )}
          {isAuth() && (
            <Fragment>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive("/posts")}
                  to="/posts"
                >
                  Posts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" style={isActive("/shop")} to="/shop">
                  <i className="fas fa-store"></i> Shop
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive(`/findpeople`)}
                  to={`/findpeople`}
                >
                  <i className="fas fa-users"></i> Find People
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/post/create"
                  style={isActive("/post/create")}
                  className="nav-link"
                >
                  <i className="fas fa-plus"></i> Post
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive(`/messaging`)}
                  to={`/messaging`}
                >
                  <i className="far fa-comment-alt"></i> Message
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive(`/user/${isAuth()._id}`)}
                  to={`/user/${isAuth()._id}`}
                >
                  <div style={{ position: "relative", height: "50px" }}>
                    <img
                      style={{
                        borderRadius: "50%",
                        // border: "1px solid black",
                      }}
                      // className="float-left mr-2"
                      height="40px"
                      width="40px"
                      onError={(i) => (i.target.src = `${DefaultProfile}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${
                        isAuth()._id
                      }`}
                      alt={isAuth().name}
                    />{" "}
                    {isAuth().name}
                  </div>
                </Link>
              </li>

              <li className="nav-item">
                <div
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    signout(() => {
                      history.push("/");
                    });
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i> Log Out
                </div>
              </li>
            </Fragment>
          )}
          <li style={{ position: "relative" }} className="nav-item">
            <Link className="nav-link" style={isActive("/cart")} to="/cart">
              <i className="fas fa-shopping-cart">
                {" "}
                <small
                  style={{
                    fontSize: "14px",
                    color: "red",
                    position: "absolute",
                    top: "20px",
                    left: "15px",
                  }}
                >
                  {itemTotal()}
                </small>
              </i>{" "}
              Cart
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
  const check = () => {
    if (isAuth() && isAuth().length !== -1) {
      return true;
    } else {
      return false;
    }
  };

  function checkChatReducer() {
    if (localStorage.getItem("checkChatReducer") === ("true" || "false")) {
      if (localStorage.getItem("checkChatReducer") === "true") {
        return true;
      }
      if (localStorage.getItem("checkChatReducer") === "false") {
        return false;
      }
    } else {
      return false;
    }
  }

  return (
    <>
      {nav()}
      <div
        style={{ overflowX: "hidden" }}
        className="container-fluid pt-3 px-0 px-xl-5"
      >
        {children}
      </div>
      {isAuth() && isAuth().length !== -1 && (
        <ChatsBox auth={check()} checkChatReducer={checkChatReducer()} />
      )}
    </>
  );
};

export default withRouter(Layout);
