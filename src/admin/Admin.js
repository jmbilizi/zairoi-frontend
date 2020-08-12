import React, { Component } from "react";
import Posts from "../post/Posts";
import Users from "../user/Users";
import { isAuth } from "../auth/helpers";
import { Redirect } from "react-router-dom";
import Layout from "../core/Layout";

class Admin extends Component {
  state = {
    redirectToHome: false,
  };

  componentDidMount() {
    if (isAuth().role !== "admin") {
      this.setState({ redirectToHome: true });
    }
  }

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }

    return (
      <Layout>
        <div>
          <div className="jumbotron">
            <h2 className="text-center">Admin Dashboard</h2>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h2>Posts</h2>
                <hr />
                <Posts />
              </div>
              <div className="col-md-6">
                <h2>Users</h2>
                <hr />
                <Users />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Admin;
