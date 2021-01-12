/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import { isAuth, getCookie } from "../auth/helpers";
import Comment from "./Comment";
import DefaultProfile from "../images/avatar.jpg";
import FollowUnfollow from "../user/FollowUnfollow";
import ChatBox from "../chat/ChatBox";
import { Player } from "video-react";
const moment = require("moment");

const SinglePost = ({ postId }) => {
  const [post, setPost] = useState();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [menu, setMenu] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const toggleOther = () => {
    setMenu(!menu);
  };

  const userId = isAuth()._id;
  const token = getCookie("token");

  const checkLike = (numberOfLikes) => {
    let match = numberOfLikes.indexOf(userId) !== -1;
    return match;
  };

  useEffect(() => {
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPost(data);
        setLikes(data.likes.length);
        setLiked(checkLike(data.likes));
        setComments(data.comments);
      }
    });
  }, []);

  const updateComments = (updatedComments) => {
    setComments(updatedComments);
  };

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

  const deletePost = () => {
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRedirectToHome(true);
      }
    });
  };

  const deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      deletePost();
    }
  };

  const showCommentFormFunc = () => {
    setShowCommentForm(!showCommentForm);
  };

  const showCommentsFunc = () => {
    setShowComments(!showComments);
  };

  const renderPost = (currentPost) => {
    const posterId = currentPost.postedBy
      ? `/user/${currentPost.postedBy._id}`
      : "";
    const posterName = currentPost.postedBy
      ? currentPost.postedBy.name
      : " Unknown";

    return (
      <div className="card rounded border border-silver mb-3 bg-white">
        <div className="row border-bottom border-silver pt-2  mx-1">
          <div className="col-auto px-1">
            <Link to={`${posterId}`}>
              <img
                style={{
                  borderRadius: "50%",
                }}
                className="float-left mb-2"
                height="50px"
                width="50px"
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
                src={`${process.env.REACT_APP_API_URL}/user/photo/${currentPost.postedBy._id}`}
                alt={currentPost.postedBy.name}
              />
            </Link>
          </div>
          <div className="col-8">
            <div className="row text-left">
              <Link to={`${posterId}`}>
                <div
                  style={{
                    lineHeight: "25px",
                    color: "black",
                  }}
                  className="btn btn-link m-0 p-0"
                >
                  <strong>{posterName}</strong>
                </div>
              </Link>
            </div>
            <div className="row text-left">
              <small className="mute">
                {moment(currentPost.created).fromNow()}
              </small>
            </div>
          </div>
          <div className="col text-right px-0">
            <div className="dropdown">
              <div
                onMouseEnter={(i) => (i.target.style.background = "#f5f5f5")}
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
                <Link to={`${posterId}`} className="dropdown-item lead">
                  <i className="far fa-eye mr-2"></i> View Profile
                </Link>

                {isAuth() && isAuth()._id !== currentPost.postedBy._id ? (
                  <Link className="dropdown-item lead">
                    <ChatBox
                      id={currentPost.postedBy._id}
                      name={currentPost.postedBy.name}
                    />
                  </Link>
                ) : (
                  ""
                )}
                {isAuth() && isAuth()._id !== currentPost.postedBy._id ? (
                  <Link className="dropdown-item lead">
                    <FollowUnfollow user={currentPost.postedBy} />
                  </Link>
                ) : (
                  ""
                )}

                {isAuth() &&
                (isAuth()._id === currentPost.postedBy._id ||
                  isAuth().role === "admin") ? (
                  <>
                    <Link
                      className="dropdown-item lead"
                      onClick={deleteConfirmed}
                    >
                      <i className="far fa-trash-alt mr-2"></i> Delete
                    </Link>
                    <Link
                      className="dropdown-item lead"
                      to={`/post/edit/${currentPost._id}`}
                    >
                      <i className="fas fa-pencil-alt mr-2"></i> Update
                    </Link>
                  </>
                ) : (
                  ""
                )}
                <Link className="dropdown-item lead" to="#">
                  <i className="fas fa-exclamation-circle mr-2"></i> Report
                </Link>
              </div>
            </div>
          </div>
        </div>
        <h5 className="mx-2 mt-2"> {currentPost.title} </h5>
        <p className="card-text mx-2">{currentPost.body}</p>
        {(currentPost.photo &&
          currentPost.photo.contentType === "image/jpeg") ||
        (currentPost.photo && currentPost.photo.contentType === "image/png") ||
        (currentPost.photo && currentPost.photo.contentType === "image/jpg") ||
        (currentPost.photo && currentPost.photo.contentType === "image/gif") ? (
          <img
            src={currentPost.photo.url}
            alt={currentPost.title}
            onError={(i) => (i.target.style.display = "none")}
            className="img-thunbnail"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        ) : (currentPost.photo &&
            currentPost.photo.contentType === "video/mp4") ||
          (currentPost.photo &&
            currentPost.photo.contentType === "video/3gp") ||
          (currentPost.photo &&
            currentPost.photo.contentType === "video/mov") ||
          (currentPost.photo &&
            currentPost.photo.contentType === "video/flv") ? (
          <Player
            autoPlay
            loop
            controls
            playsInline
            muted
            src={`${currentPost.photo.url}`}
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
                onClick={showCommentsFunc}
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
              onMouseEnter={(i) => (i.target.style.background = "#f5f5f5")}
              onMouseLeave={(i) => (i.target.style.background = "none")}
              className="col rounded text-center border border-silver py-2 m-1"
              onClick={likeToggle}
            >
              <i className="far fa-thumbs-up"></i> Like
            </div>
          ) : (
            <div
              onMouseEnter={(i) => (i.target.style.background = "#f5f5f5")}
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
            onClick={showCommentFormFunc}
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
        <div className="row m-1 mb-2">
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
        </div>
      </div>
    );
  };

  if (redirectToHome) {
    return <Redirect to={`/`} />;
  } else if (redirectToSignin) {
    return <Redirect to={`/signin`} />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 px-0">
          {!post ? (
            <div className="jumbotron text-center bg-white">
              <h2>Loading...</h2>
            </div>
          ) : (
            renderPost(post)
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
