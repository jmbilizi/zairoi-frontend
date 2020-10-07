import React, { Component } from "react";
import Posts from "../post/Posts";
import Users from "../user/Users";
import ManageProducts from "../seller/ManageProducts";
import { isAuth } from "../auth/helpers";
import { Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import { Tabs } from "antd";
import Orders from "../seller/Orders";
import CategoriesGetCreateDeleteUpdate from "../seller/CategoriesGetCreateDeleteUpdate";

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
    //tabs
    const { TabPane } = Tabs;

    function callback(key) {
      console.log(key);
    }

    const AdminTabs = () => (
      <Tabs defaultActiveKey="1" onChange={callback} centered>
        <TabPane tab="Users" key="1">
          <Users />
        </TabPane>
        <TabPane tab="Posts" key="2">
          <Posts />
        </TabPane>
        <TabPane tab="MG Products" key="3">
          <ManageProducts />
        </TabPane>
        <TabPane tab="orders" key="4">
          <Orders />
        </TabPane>
        <TabPane tab="categories" key="5">
          <CategoriesGetCreateDeleteUpdate />
        </TabPane>
        <drop />
      </Tabs>
    );

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
            <AdminTabs />
          </div>
        </div>
      </Layout>
    );
  }
}

export default Admin;
