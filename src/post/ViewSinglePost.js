import React, { Component } from "react";
import Layout from "../core/Layout";
import SinglePost from "./SinglePost";

class ViewSinglePost extends Component {
  state = {
    thePostId: "",
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    this.setState({
      thePostId: `${postId}`,
    });
  };

  render() {
    const id = this.state.thePostId;
    console.log(id);

    return <Layout>{<SinglePost postId={id} />}</Layout>;
  }
}

export default ViewSinglePost;
