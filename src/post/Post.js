import React, { useState, useEffect } from "react";
import { list } from "./apiPost";
import { isAuth } from "../auth/helpers";
import AddPost from "./AddPost";
import Layout from "../core/Layout";
import SinglePost from "./SinglePost";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const loadPosts = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };

  useEffect(() => {
    loadPosts(page);
  }, []);

  const following = isAuth().following;

  return (
    <Layout>
      <div className="row mx-0">
        <div className="col-md-3 col-sm-0"></div>
        <div className="col-md-6 col-sm-12 mx-0 px-0">
          <AddPost />
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
        <div className="col-md-3 col-sm-0"></div>
      </div>
    </Layout>
  );
};

export default Post;
