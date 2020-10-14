import React from "react";
import Layout from "../core/Layout";
import SinglePost from "./SinglePost";

const ViewSinglePost = (props) => {
  const post_id = props.match.params.postId;
  return <Layout>{<SinglePost postId={post_id} />}</Layout>;
};

export default ViewSinglePost;
