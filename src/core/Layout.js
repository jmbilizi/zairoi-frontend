import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../auth/helpers";
import DefaultProfile from "../images/avatar.jpg";
import { itemTotal } from "../shop/cartHelpers";
// import { Message } from "@primer/octicons-react";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "orange" };
    } else {
      return { color: "#fff" };
    }
  };

  const nav = () => (
    <ul
      style={{ listStyleType: "none", opacity: "100%", margin: "0", background: "black" }}
      className="navbar navbar-expand-lg nav-tabs fixed-top"
    >
      <li className="nav-item">
        <Link to="/" className="nav-link" style={isActive("/")}>
          <i
            className="fas fa-house-user"
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
              <small>Home</small>
            </span>
          </i>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive("/marketplace")}
          to="/marketplace"
        >
          Market place
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" style={isActive("/shop")} to="/shop">
          Shop
        </Link>
      </li>
      {!isAuth() && (
        <Fragment>
          <li className="nav-item">
            <Link to="/signin" className="nav-link" style={isActive("/signin")}>
              <i
                className="fas fa-sign-in-alt"
                style={{
                  fontSize: "25px",
                  position: "relative",
                  height: "50px",
                  top: "0",
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
                  <small> In</small>
                </span>
              </i>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link" style={isActive("/signup")}>
              <i
                className="fas fa-user-plus"
                style={{
                  fontSize: "25px",
                  position: "relative",
                  height: "50px",
                  top: "0",
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
                  <small>Up</small>
                </span>
              </i>
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
      {isAuth() && isAuth().role !== "subscriber" && (
        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive("/admin/dashboard")}
            to="/admin/dashboard"
          >
            Dashboard
          </Link>
        </li>
      )}
      {isAuth() && (
        <Fragment>
          <li className="nav-item">
            <Link to="/users" className="nav-link" style={isActive("/users")}>
              <i
                style={{ position: "relative", height: "50px" }}
                className="fas fa-2x fa-users"
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
                  <small>Users</small>
                </span>
              </i>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(`/findpeople`)}
              to={`/findpeople`}
            >
              Find People
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/post/create"
              style={isActive("/post/create")}
              className="nav-link"
            >
              <i
                style={{ position: "relative", height: "50px" }}
                className="fas fa-2x fa-plus"
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
                  <small>Post</small>
                </span>
              </i>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(`/messaging`)}
              to={`/messaging`}
            >
              <i
                className="far fa-envelope"
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
                  <small>Msg</small>
                </span>
              </i>
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
                  height="30px"
                  width="30px"
                  onError={(i) => (i.target.src = `${DefaultProfile}`)}
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${
                    isAuth()._id
                  }`}
                  alt={isAuth().name}
                />
                <span
                  style={{
                    position: "absolute",
                    height: "22px",
                    bottom: "0",
                    right: "0",
                    left: "0",
                    fontSize: "20px",
                  }}
                >
                  <small>Me</small>
                </span>
              </div>
            </Link>
          </li>

          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            >
              <i
                className="fas fa-sign-out-alt"
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
                  <small>Out</small>
                </span>
              </i>
            </span>
          </li>
        </Fragment>
      )}
      <li className="nav-item">
        <Link className="nav-link" style={isActive("/cart")} to="/cart">
          <i
            style={{ position: "relative", height: "50px" }}
            className="fas fa-2x fa-shopping-cart "
          >
            {" "}
            <sup>
              <small style={{}}>{itemTotal()}</small>
            </sup>
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
              <small>Cart</small>
            </span>
          </i>
        </Link>
      </li>
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div style={{ marginTop: "100px" }} className="container">
        {children}
      </div>
    </Fragment>
  );
};

export default withRouter(Layout);
