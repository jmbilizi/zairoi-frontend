import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "./helpers";

const AdminRoute = ({ component: Component, ...rest }) => (
  // props means components passed down to this private route component
  <Route
    {...rest}
    render={(props) =>
      isAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default AdminRoute;
