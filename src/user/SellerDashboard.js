import React from "react";
import Layout from "../core/Layout";
import { authenticate, isAuth } from "./helpers";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
    const {
        user: { _id, name, email, role }
    } = isAuth();

    const sellerLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">Seller Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/category">
                            Create Category
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/product">
                            Create Product
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/orders">
                            View Orders
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/products">
                            Manage Products
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    const sellerInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">
                        {role === "seller" ? "Admin" : "Registered User"}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{sellerLinks()}</div>
                <div className="col-9">{sellerInfo()}</div>
            </div>
        </Layout>
    );
};

export default SellerDashboard;
