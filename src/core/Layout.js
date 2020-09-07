import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../auth/helpers";
import DefaultProfile from "../images/avatar.jpg";
import { itemTotal } from "../shop/cartHelpers";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#000" };
    } else {
      return { color: "#fff" };
    }
  };

  const nav = () => (
    <ul className="nav fixed-top nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="nav-link" style={isActive("/")}>
          Home
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
              Signin
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link" style={isActive("/signup")}>
              Signup
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
              Users
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
              Create Post
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(`/messaging`)}
              to={`/messaging`}
            >
              Messaging
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(`/user/${isAuth()._id}`)}
              to={`/user/${isAuth()._id}`}
            >
              <img
                style={{
                  borderRadius: "50%",
                  // border: "1px solid black",
                }}
                className="float-left mr-2"
                height="30px"
                width="30px"
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
                src={`${process.env.REACT_APP_API_URL}/user/photo/${
                  isAuth()._id
                }`}
                alt={isAuth().name}
              />
              {isAuth().name}
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
              Signout
            </span>
          </li>
        </Fragment>
      )}
      <li className="nav-item">
        <Link className="nav-link" style={isActive("/cart")} to="/cart">
          Cart{" "}
          <sup>
            <small className="cart-badge">{itemTotal()}</small>
          </sup>
        </Link>
      </li>
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
