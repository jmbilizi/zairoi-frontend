import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuth, getCookie } from "../auth/helpers";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { CommentIcon } from "@primer/octicons-react";

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
          <div className="input-group mt-3 mb-3">
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
          {/* <h5 className="text-primary">
            {" "}
            <CommentIcon size={24} />
            {comments.length} Comments
          </h5> */}
          {comments.map((comment, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black",
                    }}
                    className="float-left mr-2"
                    height="30px"
                    width="30px"
                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    alt={comment.postedBy.name}
                  />
                </Link>
                <div>
                  <p className="lead">{comment.text}</p>
                  <p className="font-italic mark">
                    Posted by{" "}
                    <Link to={`/user/${comment.postedBy._id}`}>
                      {comment.postedBy.name}{" "}
                    </Link>
                    on {new Date(comment.created).toDateString()}
                    <span>
                      {isAuth() && isAuth()._id === comment.postedBy._id && (
                        <>
                          <span
                            onClick={() => this.deleteConfirmed(comment)}
                            className="text-danger float-right mr-1"
                          >
                            Remove
                          </span>
                        </>
                      )}
                    </span>
                  </p>
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