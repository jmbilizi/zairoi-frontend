import React, { useState, useEffect } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuth, getCookie } from "../auth/helpers";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
const moment = require("moment");

const Comment = ({
  showForm,
  showComments,
  postId,
  comments,
  posterId,
  updateComments,
}) => {
  const [state, setState] = useState({
    text: "",
    error: "",
  });

  const { error, text } = state;

  const handleChange = (event) => {
    setState({ error: "" });
    setState({ text: event.target.value });
  };

  const isValid = () => {
    if (!text.length > 0 || text.length > 150) {
      setState({
        error: "Comment should not be empty and less than 150 characters long",
      });
      return false;
    }
    return true;
  };

  const addComment = (e) => {
    e.preventDefault();

    if (!isAuth()) {
      setState({ error: "Please signin to leave a comment" });
      return false;
    }

    if (isValid()) {
      const userId = isAuth()._id;
      const token = getCookie("token");
      // const token = isAuth().token;

      comment(userId, token, postId, { text: text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setState({ text: "" });
          // dispatch fresh list of coments to parent (SinglePost)
          updateComments(data.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => {
    const userId = isAuth()._id;
    const token = getCookie("token");
    // const token = isAuth().token;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        updateComments(data.comments);
      }
    });
  };

  const deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are you sure you want to delete your comment?"
    );
    if (answer) {
      deleteComment(comment);
    }
  };

  return (
    <div>
      {showForm ? (
        <>
          <form onSubmit={addComment}>
            <div className="input-group mb-0">
              <img
                style={{
                  borderRadius: "50%",
                }}
                height="38px"
                width="38px"
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
                src={`${process.env.REACT_APP_API_URL}/user/photo/${
                  isAuth()._id
                }`}
                alt={isAuth().name}
              />
              <input
                type="text"
                onChange={handleChange}
                value={text}
                style={{ background: "#f9f9f9" }}
                className="form-control ml-1 rounded-pill"
                placeholder="Leave a comment..."
              />
            </div>
          </form>
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </>
      ) : (
        ""
      )}

      {showComments ? (
        <>
          {comments.map((comment, i) => (
            <div className="row mt-2 mr-auto" key={i}>
              <div className="col-auto pr-1">
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{
                      borderRadius: "50%",
                    }}
                    height="38px"
                    width="38px"
                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    alt={comment.postedBy.name}
                  />
                </Link>
              </div>
              <div
                style={{ background: "#f7f7f7" }}
                className="col rounded ml-0 mr-1"
              >
                <div className="row pt-2 pb-0">
                  <div className="col">
                    <Link to={`/user/${comment.postedBy._id}`}>
                      <strong>{comment.postedBy.name} </strong>
                    </Link>
                  </div>
                  <div className="col-auto text-right">
                    <small className="mute">
                      {moment(comment.created).fromNow()}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col">{comment.text}</div>
                </div>
                <div className="row">
                  <div className="col-auto text-dark">
                    <i className="far fa-thumbs-up"></i> 2
                  </div>
                  <div className="col-auto text-dark">
                    <i className="fas fa-comment"></i> 1
                  </div>
                  {isAuth() &&
                    (isAuth()._id === comment.postedBy._id ||
                      isAuth().role === "admin" ||
                      isAuth()._id === posterId) && (
                      <div className="col-auto text-dark ">
                        <span onClick={() => deleteConfirmed(comment)}>
                          <i className="far fa-trash-alt"></i>
                        </span>
                      </div>
                    )}
                  {isAuth() && isAuth()._id === comment.postedBy._id && (
                    <div className="col-auto text-dark">
                      <span onClick={() => deleteConfirmed()}>
                        <i className="fas fa-pencil-alt"></i>
                      </span>
                    </div>
                  )}
                  {isAuth() && isAuth()._id !== comment.postedBy._id && (
                    <div className="col-auto text-dark">
                      <span>
                        <i className="fas fa-exclamation-circle"></i>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Comment;
