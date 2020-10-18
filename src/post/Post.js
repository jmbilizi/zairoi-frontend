import React, { Component } from "react";
import { list } from "./apiPost";
import { isAuth } from "../auth/helpers";

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
    console.log(posts);
    const following = isAuth().following;

    return (
      <Layout>
        <div className="row">
          <div className="col-md-2 col-sm-0"></div>
          <div className="col-md-8 col-sm-12">
            {posts
              .filter(
                (post) =>
                  following.includes(post.postedBy._id) === true ||
                  isAuth()._id === post.postedBy._id ||
                  post.postedBy.role === "admin"
              )
              .map((post, i) => (
                <div key={i}>
                  <SinglePost postId={post._id} />
                </div>
              ))}
          </div>
          <div className="col-md-2 col-sm-0"></div>
        </div>
      </Layout>
    );
  }
}

export default Post;
