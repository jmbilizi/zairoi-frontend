import React from "react";
import Layout from "./core/Layout";
import { Helmet } from "react-helmet";
import Posts from "./post/Posts";
import Post from "./post/Post";
import MarketPlace from "./shop/MarketPlace";

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
        <div className="container">
          <MarketPlace />
        </div>
      </div>
    </Layout>
  );
};

export default App;
