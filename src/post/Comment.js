import React, { useState, useEffect } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuth, getCookie } from "../auth/helpers";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

const Comment = ({
  showForm,
  showComments,
  postId,
  comments,
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
                className="form-control ml-1 rounded-pill bg-light"
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
              <div className="col-auto">
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
              <div className="col rounded bg-light">
                <div className="row pt-2">
                  <div className="col">
                    <Link to={`/user/${comment.postedBy._id}`}>
                      <>{comment.postedBy.name} </>
                    </Link>
                  </div>
                  <div className="col-auto text-right">
                    <p>
                      <small className="font-italic">
                        {new Date(comment.created).toDateString()}
                      </small>
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <p className="lead">{comment.text}</p>
                  </div>
                </div>
                <div className="row bg-white">
                  <div className="col-auto">
                    <p className="text-dark mx-auto">
                      <i className="far fa-thumbs-up"></i> 2 Like
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="text-dark mx-auto">
                      <i className="fas fa-comment"></i> 1 Reply
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="text-dark mx-auto">
                      <span>
                        {isAuth() && isAuth()._id === comment.postedBy._id && (
                          <>
                            <span
                              onClick={() => deleteConfirmed(comment)}
                              className="text-danger"
                            >
                              <i className="far fa-trash-alt"></i> Delete
                            </span>
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="text-dark mx-auto">
                      <span>
                        {isAuth() && isAuth()._id === comment.postedBy._id && (
                          <>
                            <span
                              onClick={() => deleteConfirmed()}
                              className="text-primary"
                            >
                              <i className="fas fa-pencil-alt"></i> Edit
                            </span>
                          </>
                        )}
                      </span>
                    </p>
                  </div>
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
