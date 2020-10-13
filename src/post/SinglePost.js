import React, { useState, useEffect } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuth, getCookie } from "../auth/helpers";
import Layout from "../core/Layout";
import Comment from "./Comment";
import DefaultProfile from "../images/avatar.jpg";
import { PencilIcon, TrashIcon, CommentIcon } from "@primer/octicons-react";

const SinglePost = ({ postId }) => {
  const [post, setPost] = useState();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);

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
        console.log(data);
        setPost(data);
        setLikes(data.likes.length);
        setLiked(checkLike(data.likes));
        setComments(data.comments);
      }
    });
  }, []);

  const updateComments = (allComments) => {
    setComments({ allComments });
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

  const renderPost = (currentPost) => {
    console.log(currentPost);
    const posterId = currentPost.postedBy
      ? `/user/${currentPost.postedBy._id}`
      : "";
    const posterName = currentPost.postedBy
      ? currentPost.postedBy.name
      : " Unknown";

    return (
      <div className="card-body rounded border border-silver mb-4 bg-white">
        <div className="row border-bottom border-silver">
          <div className="col">
            <Link to={`${posterId}`}>
              <img
                style={{
                  borderRadius: "50%",
                }}
                className="float-left mr-2 mb-3"
                height="38px"
                width="38px"
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
                src={`${process.env.REACT_APP_API_URL}/user/photo/${currentPost.postedBy._id}`}
                alt={currentPost.postedBy.name}
              />
              <div
                style={{
                  lineHeight: "35px",
                }}
                className=""
              >
                <strong>{posterName}</strong>
              </div>
            </Link>
          </div>
          <div className="col-auto">
            <p
              style={{
                lineHeight: "30px",
              }}
              className="float-right font-italic mark"
            >
              {new Date(currentPost.created).toDateString()}
            </p>
          </div>
        </div>
        <h2 className="mt-2 mb-3"> {currentPost.title} </h2>
        <p className="card-text">{currentPost.body}</p>
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${currentPost._id}`}
          alt={currentPost.title}
          onError={(i) => (i.target.src = `${DefaultPost}`)}
          className="img-thunbnail mb-3"
          style={{
            height: "300px",
            width: "100%",
            objectFit: "cover",
          }}
        />
        <div className="row border-bottom border-top border-silver">
          <div className="col mt-2">
            <div className="row">
              <div className="col-auto">
                {!liked ? (
                  <p onClick={likeToggle}>
                    <i
                      className="fa fa-thumbs-up text-success bg-dark"
                      style={{ padding: "10px", borderRadius: "50%" }}
                    />{" "}
                    {likes} Like
                  </p>
                ) : (
                  <p onClick={likeToggle}>
                    <i
                      className="fa fa-thumbs-up text-warning bg-dark"
                      style={{ padding: "10px", borderRadius: "50%" }}
                    />{" "}
                    {likes} Like
                  </p>
                )}
              </div>
              <div className="col">
                <div className="row">
                  <CommentIcon size={30} />
                  <p className="text-dark ml-1 mt-2 pb-2">
                    {" "}
                    {comments.length} Comments
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-auto text-right mt-2 mb-2">
            {isAuth() && isAuth()._id === currentPost.postedBy._id && (
              <>
                <button
                  onClick={deleteConfirmed}
                  className="btn btn-raised btn-danger btn-md"
                >
                  <TrashIcon size={20} />
                </button>
                <Link
                  to={`/post/edit/${currentPost._id}`}
                  className="btn btn-raised btn-warning btn-md mx-1"
                >
                  <PencilIcon size={20} />
                </Link>
              </>
            )}
            <Link
              to={`/`}
              className="btn btn-raised btn-primary btn-md float-right"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            {isAuth() && isAuth().role === "admin" && (
              <div className="card mt-2">
                <div className="card-body">
                  <h5 className="card-title">Admin</h5>
                  <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                  <Link
                    to={`/post/edit/${currentPost._id}`}
                    className="btn btn-raised btn-warning btn-md mr-5"
                  >
                    <PencilIcon size={20} />
                  </Link>
                  <button
                    onClick={deleteConfirmed}
                    className="btn btn-raised btn-danger btn-md mr-5"
                  >
                    <TrashIcon size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Comment
          postId={currentPost._id}
          comments={comments.reverse()}
          updateComments={updateComments}
        />
      </div>
    );
  };

  if (redirectToHome) {
    return <Redirect to={`/`} />;
  } else if (redirectToSignin) {
    return <Redirect to={`/signin`} />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          {!post ? (
            <div className="jumbotron text-center">
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
