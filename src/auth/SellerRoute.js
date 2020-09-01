import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { authenticate, isAuth } from "./helpers";

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuth() && isAuth().user.role === ("seller" || "admin") ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/signin",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

export default AdminRoute;
