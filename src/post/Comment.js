import React, { useState, useEffect } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuth, getCookie } from "../auth/helpers";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import FollowUnfollow from "../user/FollowUnfollow";
import ChatBox from "../chat/ChatBox";
import { Player } from "video-react";
//sample todo later
import { singlePost, remove, like, unlike } from "./apiPost";
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

  //to do later
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  //todo later
  const userId = isAuth()._id;
  const token = getCookie("token");

  const likeToggle = () => {
    if (!isAuth()) {
      setRedirectToSignin(true);
      return false;
    }
    let callApi = liked ? unlike : like;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLiked(!liked);
        setLikes(data.likes.length);
      }
    });
  };

  const { error, text } = state;

  const handleChange = (event) => {
    setState({ error: "" });
    setState({ text: event.target.value });
  };

  const isValid = () => {
    if (!text.length > 0 || text.length > 500) {
      setState({
        error: "Comment should not be empty and less than 500 characters long",
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
          <form
            onSubmit={addComment}
            className="card rounded border border-silver mb-0 bg-white"
          >
            <div className="row py-2  mx-1">
              <div className="col-auto px-1 ">
                <Link to={`/user/${isAuth()._id}`}>
                  <img
                    style={{
                      borderRadius: "50%",
                    }}
                    height="50px"
                    width="50px"
                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${
                      isAuth()._id
                    }`}
                    alt={isAuth().name}
                  />
                </Link>
              </div>
              <div className="col px-0 py-2">
                <input
                  type="text"
                  onChange={handleChange}
                  value={text}
                  style={{ background: "#f9f9f9" }}
                  className="form-control rounded-pill"
                  placeholder="Leave a comment..."
                />
              </div>
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
            <div className="card rounded border border-silver mt-2 mb-0 bg-white">
              <div className="row border-bottom border-silver pt-2  mx-1">
                <div className="col-auto px-1">
                  <Link to={`/user/${comment.postedBy._id}`}>
                    <img
                      style={{
                        borderRadius: "50%",
                      }}
                      className="float-left mb-2"
                      height="50px"
                      width="50px"
                      onError={(i) => (i.target.src = `${DefaultProfile}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                      alt={comment.postedBy.name}
                    />
                  </Link>
                </div>
                <div className="col-8">
                  <div className="row text-left">
                    <Link to={`/user/${comment.postedBy._id}`}>
                      <div
                        style={{
                          lineHeight: "25px",
                          color: "black",
                        }}
                        className="btn btn-link m-0 p-0"
                      >
                        <strong>{comment.postedBy.name} </strong>
                      </div>
                    </Link>
                  </div>
                  <div className="row text-left">
                    <small className="mute">
                      {moment(comment.created).fromNow()}
                    </small>
                  </div>
                </div>
                <div className="col text-right px-0">
                  <div className="dropdown">
                    <div
                      onMouseEnter={(i) =>
                        (i.target.style.background = "#f5f5f5")
                      }
                      onMouseLeave={(i) => (i.target.style.background = "none")}
                      style={{
                        paddingLeft: "6px",
                        paddingRight: "6px",
                      }}
                      className="btn"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-h"></i>
                    </div>
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <Link
                        to={`/user/${comment.postedBy._id}`}
                        className="dropdown-item lead"
                      >
                        <i className="far fa-eye mr-2"></i> View Profile
                      </Link>

                      {isAuth() && isAuth()._id !== comment.postedBy._id ? (
                        <Link className="dropdown-item lead">
                          <ChatBox
                            id={comment.postedBy._id}
                            name={comment.postedBy.name}
                          />
                        </Link>
                      ) : (
                        ""
                      )}
                      {/* {isAuth() && isAuth()._id !== comment.postedBy._id ? (
                        <Link className="dropdown-item lead">
                          <FollowUnfollow user={comment.postedBy} />
                        </Link>
                      ) : (
                        ""
                      )} */}

                      {isAuth() &&
                      (isAuth()._id === comment.postedBy._id ||
                        isAuth().role === "admin") ? (
                        <>
                          <Link
                            className="dropdown-item lead"
                            onClick={() => deleteConfirmed(comment)}
                          >
                            <i className="far fa-trash-alt mr-2"></i> Delete
                          </Link>
                          <Link
                            className="dropdown-item lead"
                            to={`/post/edit/${comment._id}`}
                          >
                            <i className="fas fa-pencil-alt mr-2"></i> Update
                          </Link>
                        </>
                      ) : (
                        ""
                      )}
                      <Link className="dropdown-item lead" to="#">
                        <i className="fas fa-exclamation-circle mr-2"></i>{" "}
                        Report
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <p className="card-text mx-2 mt-2 mb-0 lead">{comment.text}</p>
              {(comment.photo && comment.photo.contentType === "image/jpeg") ||
              (comment.photo && comment.photo.contentType === "image/png") ||
              (comment.photo && comment.photo.contentType === "image/jpg") ||
              (comment.photo && comment.photo.contentType === "image/gif") ? (
                <img
                  src={comment.photo.url}
                  alt={comment.title}
                  onError={(i) => (i.target.style.display = "none")}
                  className="img-thunbnail"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (comment.photo &&
                  comment.photo.contentType === "video/mp4") ||
                (comment.photo && comment.photo.contentType === "video/3gp") ||
                (comment.photo && comment.photo.contentType === "video/mov") ||
                (comment.photo && comment.photo.contentType === "video/flv") ? (
                <Player
                  autoPlay
                  loop
                  controls
                  playsInline
                  muted
                  src={`${comment.photo.url}`}
                  width="100%"
                  height="100%"
                />
              ) : (
                ""
              )}
              <div className="row">
                <div className="col">
                  <ul
                    style={{ listStyleType: "none", paddingTop: "10px" }}
                    className="px-2 "
                  >
                    <li className="btn btn-link p-0 float-left text-dark">
                      {likes} Likes
                    </li>
                    <li className="btn btn-link p-0 float-right text-dark">
                      1 Shares
                    </li>
                    <li className="btn btn-link p-0 float-right px-2 text-dark">
                      10 views
                    </li>
                    <li
                      //onClick={showCommentsFunc}
                      className="btn btn-link p-0 float-left px-2 text-dark"
                    >
                      {comments.length} Comments
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row border-bottom border-top border-silver mx-2">
                {!liked ? (
                  <div
                    onMouseEnter={(i) =>
                      (i.target.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(i) => (i.target.style.background = "none")}
                    className="col rounded text-center border border-silver py-2 m-1"
                    onClick={likeToggle}
                  >
                    <i className="far fa-thumbs-up"></i> Like
                  </div>
                ) : (
                  <div
                    onMouseEnter={(i) =>
                      (i.target.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(i) => (i.target.style.background = "none")}
                    className="col rounded text-center border border-silver py-2 m-1"
                    onClick={likeToggle}
                  >
                    <i className="far fa-thumbs-down"></i> Unlike
                  </div>
                )}

                <div
                  onMouseEnter={(i) => (i.target.style.background = "#f5f5f5")}
                  onMouseLeave={(i) => (i.target.style.background = "none")}
                  className="col rounded text-center border border-silver py-2 m-1"
                  //onClick={showCommentFormFunc}
                >
                  <i className="far fa-comment-alt"></i> Comment
                </div>
                <div
                  onMouseEnter={(i) => (i.target.style.background = "#f5f5f5")}
                  onMouseLeave={(i) => (i.target.style.background = "none")}
                  className="col rounded text-center border border-silver py-2 m-1"
                >
                  <i className="far fa-share-square"></i> Share
                </div>
              </div>
              {/* <div className="row m-1 mb-2">
                <div className="col-12 px-1">
                  <Comment
                    showForm={showCommentForm}
                    showComments={showComments}
                    postId={currentPost._id}
                    posterId={currentPost.postedBy}
                    comments={comments.slice(0).reverse()}
                    updateComments={updateComments}
                  />
                </div>
              </div> */}
            </div>
            // <div className="row mt-2 mr-auto" key={i}>
            //   <div className="col-auto pr-1">
            //     <Link to={`/user/${comment.postedBy._id}`}>
            //       <img
            //         style={{
            //           borderRadius: "50%",
            //         }}
            //         height="38px"
            //         width="38px"
            //         onError={(i) => (i.target.src = `${DefaultProfile}`)}
            //         src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
            //         alt={comment.postedBy.name}
            //       />
            //     </Link>
            //   </div>
            //   <div
            //     // style={{ background: "#f7f7f7" }}
            //     className="col rounded border border-silver ml-0 mr-1"
            //   >
            //     <div className="row pt-1 pb-0">
            //       <div className="col">
            //         <Link to={`/user/${comment.postedBy._id}`}>
            //           <div
            //             style={{
            //               color: "black",
            //             }}
            //             className="btn btn-link m-0 p-0"
            //           >
            //             <strong>{comment.postedBy.name} </strong>
            //           </div>
            //         </Link>
            //       </div>
            //       <div className="col-auto text-right">
            //         <small className="mute">
            //           {moment(comment.created).fromNow()}
            //         </small>
            //       </div>
            //     </div>
            //     <div className="row">
            //       <div className="col">{comment.text}</div>
            //     </div>
            //     <div className="row">
            //       <div className="col-auto text-dark">
            //         <i className="far fa-thumbs-up"></i> 2
            //       </div>
            //       <div className="col-auto text-dark">
            //         <i className="fas fa-comment"></i> 1
            //       </div>
            //       {isAuth() &&
            //         (isAuth()._id === comment.postedBy._id ||
            //           isAuth().role === "admin" ||
            //           isAuth()._id === posterId) && (
            //           <div className="col-auto text-dark ">
            //             <span onClick={() => deleteConfirmed(comment)}>
            //               <i className="far fa-trash-alt"></i>
            //             </span>
            //           </div>
            //         )}
            //       {isAuth() && isAuth()._id === comment.postedBy._id && (
            //         <div className="col-auto text-dark">
            //           <span onClick={() => deleteConfirmed()}>
            //             <i className="fas fa-pencil-alt"></i>
            //           </span>
            //         </div>
            //       )}
            //       {isAuth() && isAuth()._id !== comment.postedBy._id && (
            //         <div className="col-auto text-dark">
            //           <span>
            //             <i className="fas fa-exclamation-circle"></i>
            //           </span>
            //         </div>
            //       )}
            //     </div>
            //   </div>
            // </div>
          ))}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Comment;
