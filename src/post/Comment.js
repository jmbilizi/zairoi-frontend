import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuth, getCookie } from "../auth/helpers";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { TrashIcon } from "@primer/octicons-react";

class Comment extends Component {
  state = {
    text: "",
    error: "",
  };

  handleChange = (event) => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Comment should not be empty and less than 150 characters long",
      });
      return false;
    }
    return true;
  };

  addComment = (e) => {
    e.preventDefault();

    if (!isAuth()) {
      this.setState({ error: "Please signin to leave a comment" });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuth()._id;
      const token = getCookie("token");
      // const token = isAuth().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          // dispatch fresh list of coments to parent (SinglePost)
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  deleteComment = (comment) => {
    const userId = isAuth()._id;
    const token = getCookie("token");
    // const token = isAuth().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are you sure you want to delete your comment?"
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        {/* <h2 className="mt-2 mb-2">Leave a comment</h2> */}
        <form onSubmit={this.addComment}>
          <div className="input-group mt-3 mb-0">
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.text}
              className="form-control"
              placeholder="Leave a comment..."
            />
            <div className="input-group-append">
              <button className="btn btn-raised btn-success">Comment</button>
            </div>
          </div>
        </form>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div className="col-md-12">
          {comments.map((comment, i) => (
            <div key={i}>
              <div>
                <div className="row mt-3 justify-content-center">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-md-1 col-sm-4 text-right">
                        <Link to={`/user/${comment.postedBy._id}`}>
                          <img
                            style={{
                              borderRadius: "50%",
                            }}
                            className=""
                            height="40px"
                            width="40px"
                            onError={(i) =>
                              (i.target.src = `${DefaultProfile}`)
                            }
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                            alt={comment.postedBy.name}
                          />
                        </Link>
                      </div>
                      <div className="col-md-11 col-sm-8 rounded bg-light">
                        <div className="row pt-2">
                          <div className="col-lg-6 col-md-6 col-sm-6 text-left">
                            <Link to={`/user/${comment.postedBy._id}`}>
                              <>{comment.postedBy.name} </>
                            </Link>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 text-right">
                            <p>
                              <small className="font-italic">
                                {new Date(comment.created).toDateString()}
                              </small>
                            </p>
                          </div>
                        </div>
                        <div className="row pt-2">
                          <div className="col-sm-12">
                            <p className="lead">{comment.text}</p>
                          </div>
                        </div>
                        <div className="row bg-white">
                          <div className="col-3">
                            <div className="row">
                              <p className="text-dark ml-1 mt-2 pb-2">
                                <i className="far fa-thumbs-up"></i> 2 Like
                              </p>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="row">
                              <p className="text-dark ml-1 mt-2 pb-2">
                                <i className="fas fa-comment"></i> 1 Reply
                              </p>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="row">
                              <p className="text-dark ml-1 mt-2 pb-2">
                                <span>
                                  {isAuth() &&
                                    isAuth()._id === comment.postedBy._id && (
                                      <>
                                        <span
                                          onClick={() =>
                                            this.deleteConfirmed(comment)
                                          }
                                          className="text-danger"
                                        >
                                          <i class="far fa-trash-alt"></i>{" "}
                                          Delete
                                        </span>
                                      </>
                                    )}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="row">
                              <p className="text-dark ml-1 mt-2 pb-2">
                                <span>
                                  {isAuth() &&
                                    isAuth()._id === comment.postedBy._id && (
                                      <>
                                        <span
                                          onClick={() =>
                                            this.deleteConfirmed()
                                          }
                                          className="text-primary"
                                        >
                                          <i class="fas fa-pencil-alt"></i> Edit
                                        </span>
                                      </>
                                    )}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Comment;
