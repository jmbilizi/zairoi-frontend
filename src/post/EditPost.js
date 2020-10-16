import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuth, getCookie } from "../auth/helpers";
import { Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import DefaultPost from "../images/mountains.jpg";

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToPost: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToPost: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }
    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const postId = this.props.match.params.postId;
      const token = getCookie("token");

      update(postId, token, this.postData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            redirectToPost: true,
          });
        }
      });
    }
  };

  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Body</label>
        <textarea
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}
        />
      </div>

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update Post
      </button>
    </form>
  );

  render() {
    const { id, title, body, redirectToPost, error, loading } = this.state;
    console.log(id);

    if (redirectToPost) {
      return <Redirect to={`/post/${id}`} />;
    }
    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/post/photo/${id}?${new Date().getTime()}`
      : DefaultPost;

    return (
      <Layout>
        <div className="container">
          <h2 className="mt-5 mb-3">{title}</h2>

          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>

          {loading ? (
            <div className="jumbotron text-center">
              <h2>Loading...</h2>
            </div>
          ) : (
            ""
          )}

          <img
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            src={photoUrl}
            // onError={(i) => (i.target.src = `${DefaultPost}`)}
            onError={(i) => (i.target.style.display = "none")}
            alt={title}
          />

          {isAuth().role === "admin" && this.editPostForm(title, body)}

          {isAuth()._id === id && this.editPostForm(title, body)}
        </div>
      </Layout>
    );
  }
}

export default EditPost;
