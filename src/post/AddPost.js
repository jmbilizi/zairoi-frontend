import React, { Component } from "react";
import { isAuth, getCookie } from "../auth/helpers";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";
import { Modal } from "antd";
import DefaultProfile from "../images/avatar.jpg";

class AddPost extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false,
      visible: false,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuth() });
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 100000) {
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
      const userId = isAuth()._id;
      const token = getCookie("token");

      create(userId, token, this.postData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            redirectToProfile: true,
          });
        }
      });
    }
  };

  newPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Photo/Video/Audio</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          multiple
          accept="image/*|audio/*|video/*"
          // accept="image/*"
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
      <div className="text-center">
        <button
          onClick={this.clickSubmit}
          className="btn btn-raised btn-primary text-center"
        >
          Create Post
        </button>
      </div>
    </form>
  );

  render() {
    const { title, body, user, error, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div
              className="card rounded border border-silver mb-3 bg-white"
              style={{ height: "70px" }}
              onClick={this.showModal}
            >
              <form>
                <div className="input-group mb-0">
                  <img
                    style={{
                      borderRadius: "50%",
                    }}
                    className="ml-1 m-2"
                    height="50px"
                    width="50px"
                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${
                      isAuth()._id
                    }`}
                    alt={isAuth().name}
                  />
                  <input
                    type="text"
                    style={{ background: "#f9f9f9" }}
                    className="form-control rounded-pill my-3 mr-2"
                    placeholder="Start you new post..."
                  />
                </div>
              </form>
            </div>
            <Modal
              title="Create Post"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div className="container mb-2">
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

                {this.newPostForm(title, body)}
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPost;
