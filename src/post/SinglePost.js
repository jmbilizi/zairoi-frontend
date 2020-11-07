import React, { useState, useEffect } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import { isAuth, getCookie } from "../auth/helpers";
import Comment from "./Comment";
import DefaultProfile from "../images/avatar.jpg";
import { PencilIcon, TrashIcon, CommentIcon } from "@primer/octicons-react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const moment = require("moment");

const SinglePost = ({ postId }) => {
  const [post, setPost] = useState();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [menu, setMenu] = useState(false);

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
    const posterId = currentPost.postedBy
      ? `/user/${currentPost.postedBy._id}`
      : "";
    const posterName = currentPost.postedBy
      ? currentPost.postedBy.name
      : " Unknown";

    return (
      <div className="card rounded border border-silver mb-3 bg-white">
        <div className="row border-bottom border-silver mt-3 mx-1">
          <div className="col-auto">
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
                  className=""
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
          <div className="col text-right">
            <Dropdown isOpen={menu} toggle={toggleOther}>
              <DropdownToggle
                style={{
                  // "&:hover": {
                  //   backgroundColor: "#f5f5f5",
                  // },
                  paddingLeft: "6px",
                  paddingRight: "6px",
                }}
                className="btn"
                tag="i"
              >
                <i className="fas fa-ellipsis-h"></i>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href={`${posterId}`}>View Profile</DropdownItem>

                {isAuth() && isAuth()._id !== currentPost.postedBy._id ? (
                  <>
                    <DropdownItem href="#">Message</DropdownItem>
                  </>
                ) : (
                  ""
                )}
                <DropdownItem href="#">Action</DropdownItem>
                <DropdownItem href="#">Another Action</DropdownItem>
                {isAuth() && isAuth()._id === currentPost.postedBy._id ? (
                  <>
                    <DropdownItem onClick={deleteConfirmed}>
                      Delete
                    </DropdownItem>
                    <DropdownItem href={`/post/edit/${currentPost._id}`}>
                      Update
                    </DropdownItem>
                  </>
                ) : (
                  ""
                )}
                <DropdownItem href="#">Report</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <h5 className="mx-3 mt-2"> {currentPost.title} </h5>
        <p className="card-text mx-3">{currentPost.body}</p>
        {currentPost.photo ? (
          <img
            src={currentPost.photo.url}
            alt={currentPost.title}
            onError={(i) => (i.target.style.display = "none")}
            className="img-thunbnail mb-3"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          ""
        )}

        <div className="row border-bottom border-top border-silver mx-1">
          <div className="col mt-3">
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

          <div className="col-auto mt-3 text-right">
            {isAuth() && isAuth()._id === currentPost.postedBy._id && (
              <>
                <button
                  onClick={deleteConfirmed}
                  className="btn btn-raised btn-danger btn-sm"
                >
                  <TrashIcon size={18} />
                </button>
                <Link
                  to={`/post/edit/${currentPost._id}`}
                  className="btn btn-raised btn-warning btn-sm mx-1"
                >
                  <PencilIcon size={18} />
                </Link>
              </>
            )}
            <Link
              to={`/`}
              className="btn btn-raised btn-primary btn-sm float-right"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            {isAuth() && isAuth().role === "admin" && (
              <div className="card mt-2 rounded border border-silver">
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
        <div className="row m-1 mb-2">
          <div className="col-12">
            <Comment
              postId={currentPost._id}
              comments={comments.reverse()}
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
