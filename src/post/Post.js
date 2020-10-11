import React, { Component } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/mountains.jpg";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import { isAuth, getCookie } from "../auth/helpers";
import Layout from "../core/Layout";
import Comment from "./Comment";
import DefaultProfile from "../images/avatar.jpg";
import { PencilIcon, TrashIcon, CommentIcon } from "@primer/octicons-react";

class Post extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      page: 1,
      post: "",
      redirectToHome: false,
      redirectToSignin: false,
      like: false,
      likes: 0,
      comments: [],
    };
  }

  checkLike = (likes) => {
    const userId = isAuth() && isAuth()._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };
  loadPosts = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        for (let item of data) {
          this.setState({
            posts: data,
            post: item,
            likes: item.likes.length,
            like: this.checkLike(item.likes),
            comments: item.comments,
          });
        }
      }
    });
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }
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

  loadMore = (number) => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
  };

  loadLess = (number) => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
  };

  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " Unknown";

          const { likes, comments } = this.state;

          return (
            <div
              className="card-body rounded border border-silver mt-4"
              key={i}
            >
              <div className="row border-bottom border-silver">
                <div className="col-sm-5">
                  <Link to={`${posterId}`}>
                    <img
                      style={{
                        borderRadius: "50%",
                        border: "1px solid black",
                      }}
                      className="float-left mr-2"
                      height="30px"
                      width="30px"
                      onError={(i) => (i.target.src = `${DefaultProfile}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${post.postedBy._id}`}
                      alt={post.postedBy.name}
                    />
                    {posterName}
                  </Link>
                </div>
                <div className="col-sm-7">
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
                        <p className="text-dark ml-1 mt-2 pb-2">
                          {" "}
                          {comments.length} Comments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm mt-2 mb-2">
                  {isAuth() && isAuth()._id === post.postedBy._id && (
                    <>
                      <button
                        onClick={this.deleteConfirmed}
                        className="btn btn-raised btn-danger btn-md float-sm-right mr-3 ml-3"
                      >
                        <TrashIcon size={24} />
                      </button>
                      <Link
                        to={`/post/edit/${post._id}`}
                        className="btn btn-raised btn-warning btn-md float-sm-right mr-3"
                      >
                        <PencilIcon size={24} />
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  {isAuth() && isAuth().role === "admin" && (
                    <div class="card mt-5">
                      <div className="card-body">
                        <h5 className="card-title">Admin</h5>
                        <p className="mb-2 text-danger">
                          Edit/Delete as an Admin
                        </p>
                        <Link
                          to={`/post/edit/${post._id}`}
                          className="btn btn-raised btn-warning btn-md mr-5"
                        >
                          <PencilIcon size={24} />
                        </Link>
                        <button
                          onClick={this.deleteConfirmed}
                          className="btn btn-raised btn-danger btn-md mr-5"
                        >
                          <TrashIcon size={24} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Comment
                postId={post._id}
                comments={comments.reverse()}
                updateComments={this.updateComments}
              />
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts, page, redirectToHome, redirectToSignin } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-2 col-sm-12"></div>
            <div className="col-md-8 col-sm-12">
              <h2 className="mt-2 mb-2">
                {!posts.length ? "No more posts!" : "Recent Posts"}
              </h2>

              {this.renderPosts(posts)}

              {page > 1 ? (
                <button
                  className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                  onClick={() => this.loadLess(1)}
                >
                  Previous ({this.state.page - 1})
                </button>
              ) : (
                ""
              )}

              {posts.length ? (
                <button
                  className="btn btn-raised btn-success mt-5 mb-5"
                  onClick={() => this.loadMore(1)}
                >
                  Next ({page + 1})
                </button>
              ) : (
                ""
              )}
            </div>
            <div className="col-md-2 col-sm-12"></div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Post;
