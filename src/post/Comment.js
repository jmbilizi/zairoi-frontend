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
                <div className="row rounded border border-silver mt-3">
                  <div className="col-sm-1 border-right border-silver">
                    <Link to={`/user/${comment.postedBy._id}`}>
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "1px solid black",
                        }}
                        className="mt-2 mr-3"
                        height="30px"
                        width="30px"
                        onError={(i) => (i.target.src = `${DefaultProfile}`)}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                        alt={comment.postedBy.name}
                      />
                    </Link>
                  </div>
                  <div className="col-sm-11">
                    <div className="row pt-2 border-bottom border-silver">
                      <div className="col-sm-5">
                        <Link to={`/user/${comment.postedBy._id}`}>
                          <>{comment.postedBy.name} </>
                        </Link>
                      </div>
                      <div className="col-sm-7 text-right">
                        <p>
                          <small className="font-italic">
                            Posted on{" "}
                            {new Date(comment.created).toDateString()}
                          </small>
                        </p>
                      </div>
                    </div>
                    <div className="row pt-2">
                      <div className="col-sm-11">
                        <p className="lead">{comment.text}</p>
                      </div>
                      <div className="col-sm-1 text-right">
                        <p>
                          <span>
                            {isAuth() && isAuth()._id === comment.postedBy._id && (
                              <>
                                <span
                                  onClick={() => this.deleteConfirmed(comment)}
                                  className="text-danger"
                                >
                                  <TrashIcon size={24} />
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
          ))}
        </div>
      </div>
    );
  }
}

export default Comment;
