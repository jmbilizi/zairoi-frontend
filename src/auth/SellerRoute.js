import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { authenticate, isAuth } from "./helpers";

const SellerRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuth() && isAuth().role === ("seller" || "admin") ? (
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

export default SellerRoute;
