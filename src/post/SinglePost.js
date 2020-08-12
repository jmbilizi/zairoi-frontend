import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuth, getCookie } from "../auth/helpers";
import Layout from "../core/Layout";
import Comment from "./Comment";
import DefaultProfile from "../images/avatar.jpg";
import { PencilIcon, TrashIcon, CommentIcon } from "@primer/octicons-react";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: [],
  };

  checkLike = (likes) => {
    const userId = isAuth() && isAuth()._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments,
        });
      }
    });
  };

  updateComments = (comments) => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (!isAuth()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuth()._id;
    const postId = this.state.post._id;
    const token = getCookie("token");
    // const token = isAuth().token;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = getCookie("token");
    // const token = isAuth().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

    const { like, likes, comments } = this.state;

    return (
      <div className="card-body border border-silver mt-4">
        <div className="row border-bottom border-silver">
          <div className="col-sm-6">
            <Link to={`${posterId}`}>
              <img
                style={{
                  borderRadius: "50%",
                  border: "1px solid black",
                }}
                className="float-left mr-3"
                height="30px"
                width="30px"
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
                src={`${process.env.REACT_APP_API_URL}/user/photo/${post.postedBy._id}`}
                alt={post.postedBy.name}
              />
              {posterName}
            </Link>
          </div>
          <div className="col-sm-6">
            <p className="float-right font-italic mark">
              Posted on {new Date(post.created).toDateString()}
            </p>
          </div>
        </div>
        <h2 className="mt-2 mb-3"> {post.title} </h2>
        <p className="card-text">{post.body}</p>
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title}
          onError={(i) => (i.target.src = `${DefaultPost}`)}
          className="img-thunbnail mb-3"
          style={{
            height: "300px",
            width: "100%",
            objectFit: "cover",
          }}
        />
        <div className="row border-bottom border-top border-silver">
          <div className="col-sm mt-2">
            <div className="row">
              <div className="col-5">
                {like ? (
                  <p onClick={this.likeToggle}>
                    <i
                      className="fa fa-thumbs-up text-success bg-dark"
                      style={{ padding: "10px", borderRadius: "50%" }}
                    />{" "}
                    {likes} Like
                  </p>
                ) : (
                  <p onClick={this.likeToggle}>
                    <i
                      className="fa fa-thumbs-up text-warning bg-dark"
                      style={{ padding: "10px", borderRadius: "50%" }}
                    />{" "}
                    {likes} Like
                  </p>
                )}
              </div>
              <div className="col-7">
                <div className="row">
                  <CommentIcon size={35} />
                  <p className="text-dark ml-1 mt-2">
                    {" "}
                    {comments.length} Comments
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm mt-2 mb-2">
            <Link
              to={`/`}
              className="btn btn-raised btn-primary btn-md float-sm-right"
            >
              Back to posts
            </Link>

            {isAuth() && isAuth()._id === post.postedBy._id && (
              <>
                <button
                  onClick={this.deleteConfirmed}
                  className="btn btn-raised btn-danger btn-md float-sm-right mr-3"
                >
                  <TrashIcon size={24} /> Delete
                </button>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-warning btn-md float-sm-right mr-3"
                >
                  <PencilIcon size={24} /> Edit
                </Link>
              </>
            )}

            <div>
              {isAuth() && isAuth().role === "admin" && (
                <div class="card mt-5">
                  <div className="card-body">
                    <h5 className="card-title">Admin</h5>
                    <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                    <Link
                      to={`/post/edit/${post._id}`}
                      className="btn btn-raised btn-warning btn-md mr-5"
                    >
                      <PencilIcon size={24} /> Edit
                    </Link>
                    <button
                      onClick={this.deleteConfirmed}
                      className="btn btn-raised btn-danger btn-md mr-5"
                    >
                      <TrashIcon size={24} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  };

  render() {
    const { post, redirectToHome, redirectToSignin } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <Layout>
        <div className="container">
          {!post ? (
            <div className="jumbotron text-center">
              <h2>Loading...</h2>
            </div>
          ) : (
            this.renderPost(post)
          )}
        </div>
      </Layout>
    );
  }
}

export default SinglePost;
