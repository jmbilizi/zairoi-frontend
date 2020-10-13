import React, { Component } from "react";
import { list } from "./apiPost";

import Layout from "../core/Layout";
import SinglePost from "./SinglePost";

class Post extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      page: 1,
    };
  }

  loadPosts = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          posts: data,
        });
      }
    });
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }

  render() {
    const { posts } = this.state;

    return (
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-2 col-sm-12"></div>
            <div className="col-md-8 col-sm-12">
              {posts.map((post, i) => (
                <div key={i}>
                  <SinglePost postId={post._id} />
                </div>
              ))}
            </div>
            <div className="col-md-2 col-sm-12"></div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Post;
