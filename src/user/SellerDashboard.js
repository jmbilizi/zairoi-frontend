import React from "react";
import Layout from "../core/Layout";
import { authenticate, isAuth } from "../auth/helpers";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  // const {
  //     user: { _id, name, email, role }
  // } = isAuth();

  const _id = isAuth()._id;
  const name = isAuth().name;
  const email = isAuth().email;
  const role = isAuth().role;

  const sellerLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Seller Links</h4>
        <ul className="list-group">
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
      <div className="card mt-10 mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === "seller" || "admin" ? `${role}` : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
    // title="Dashboard"
    // description={`G'day ${name}!`}
    // className="container-fluid"
    >
      <div className="row">
        <div className="col-3">{sellerLinks()}</div>
        <div className="col-9">{sellerInfo()}</div>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
