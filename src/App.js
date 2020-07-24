import React from "react";
import Layout from "./core/Layout";
import { Helmet } from "react-helmet";
import Posts from "./post/Posts";

const App = () => {
  const head = () => (
    <Helmet>
      <meta charSet="utf-8" />
      <title>ZAIROI APP</title>
      <link rel="canonical" href="https://mern-stack.com" />
    </Helmet>
  );
  return (
    <Layout>
      {head()}
      <div>
        <div className="jumbotron">
          <h2>ZAIROI APP</h2>
          <p className="lead">Welcome to React Frontend</p>
        </div>
        <div className="container">
          <Posts />
        </div>
      </div>
    </Layout>
  );
};

export default App;
