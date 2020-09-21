import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { isAuth, getCookie } from "../auth/helpers";
import DefaultPost from "../images/mountains.jpg";
import { PencilIcon, TrashIcon, CommentIcon } from "@primer/octicons-react";
// import Comment from "../post/Comment";
import { remove, like, unlike } from "../post/apiPost";
import FollowProfileButton from "./FollowProfileButton";
import { read } from "./apiUser";
// import antd from "antd";
import "antd/dist/antd.css";
import { Tabs } from "antd";

const NewProfileTab = ({
  user,
  following,
  followers,
  clickFollowButton,
  posts,
}) => {
  console.log(posts);

  let deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = getCookie("token");
    // const token = isAuth().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  let deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      deletePost();
    }
  };

  // let likeToggle = () => {
  //   if (!isAuth()) {
  //     this.setState({ redirectToSignin: true });
  //     return false;
  //   }
  //   let callApi = this.state.like ? unlike : like;
  //   const userId = isAuth()._id;
  //   const postId = this.state.post._id;
  //   const token = getCookie("token");
  //   // const token = isAuth().token;

  //   callApi(userId, token, postId).then((data) => {
  //     if (data.error) {
  //       console.log(data.error);
  //     } else {
  //       this.setState({
  //         like: !this.state.like,
  //         likes: data.likes.length,
  //       });
  //     }
  //   });
  // };

  // let updateComments = (comments) => {
  //   this.setState({ comments });
  // };

  const allPosts = () => (
    <>
      {posts.reverse().map((post, i) => (
        <div key={i}>
          <div>
            <div>
              <div className="card-body rounded border border-silver mt-4">
                <div className="row border-bottom border-silver">
                  <div className="col-sm-5">
                    <Link
                      to={`${
                        post.postedBy ? `/user/${post.postedBy._id}` : ""
                      }`}
                    >
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "1px solid black",
                        }}
                        className="float-left mr-2"
                        height="30px"
                        width="30px"
                        onError={(i) => (i.target.src = `${DefaultProfile}`)}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${post.postedBy._id}`}
                        alt={post.postedBy.name}
                      />
                      {post.postedBy ? post.postedBy.name : " Unknown"}
                    </Link>
                  </div>
                  <div className="col-sm-7">
                    <p className="float-right font-italic mark">
                      Posted on {new Date(post.created).toDateString()}
                    </p>
                  </div>
                </div>
                <h2 className="mt-2 mb-3"> {post.title} </h2>
                <p className="card-text">{post.body}</p>
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt={post.title}
                  onError={(i) => (i.target.src = `${DefaultPost}`)}
                  className="img-thunbnail mb-3"
                  style={{
                    height: "300px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="row border-bottom border-top border-silver">
                  <div className="col-sm mt-2">
                    <div className="row">
                      <div className="col-5">
                        {like ? (
                          <p>
                            <i
                              className="fa fa-thumbs-up text-success bg-dark"
                              style={{ padding: "10px", borderRadius: "50%" }}
                            />{" "}
                            {post.likes.length} Like
                          </p>
                        ) : (
                          <p>
                            <i
                              className="fa fa-thumbs-up text-warning bg-dark"
                              style={{ padding: "10px", borderRadius: "50%" }}
                            />{" "}
                            {post.likes.length} Like
                          </p>
                        )}
                      </div>
                      <div className="col-7">
                        <div className="row">
                          <CommentIcon size={35} />
                          <p className="text-dark ml-1 mt-2 pb-2">
                            {" "}
                            {post.comments.length} Comments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm mt-2 mb-2">
                    <Link
                      to={`/post/${post._id}`}
                      className="btn btn-raised btn-primary btn-md float-sm-right ml-2"
                    >
                      View post
                    </Link>

                    {isAuth() && isAuth()._id === post.postedBy._id && (
                      <>
                        <button
                          onClick={deleteConfirmed}
                          className="btn btn-raised btn-danger btn-md float-sm-right mr-3 ml-3"
                        >
                          <TrashIcon size={24} />
                        </button>
                        <Link
                          to={`/post/edit/${post._id}`}
                          className="btn btn-raised btn-warning btn-md float-sm-right mr-3"
                        >
                          <PencilIcon size={24} />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    {isAuth() && isAuth().role === "admin" && (
                      <div class="card mt-5">
                        <div className="card-body">
                          <h5 className="card-title">Admin</h5>
                          <p className="mb-2 text-danger">
                            Edit/Delete as an Admin
                          </p>
                          <Link
                            to={`/post/edit/${post._id}`}
                            className="btn btn-raised btn-warning btn-md mr-5"
                          >
                            <PencilIcon size={24} />
                          </Link>
                          <button
                            onClick={deleteConfirmed}
                            className="btn btn-raised btn-danger btn-md mr-5"
                          >
                            <TrashIcon size={24} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* <Comment
                  postId={post._id}
                  comments={post.comments.reverse()}
                  updateComments={updateComments}
                /> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  const allFollowers = () => (
    <>
      {followers.map((person, i) => (
        <div className="card col-lg-3 col-md-4 col-sm-5 mx-auto" key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="pt-2"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={person.name}
          />
          <div className="card-body">
            <h5 className="card-title">{person.name}</h5>
            <p className="card-text">{person.email}</p>
            <Link
              to={`/user/${person._id}`}
              className="btn btn-raised btn-primary float-right"
            >
              <i className="fas fa-eye"></i>
            </Link>
            <FollowProfileButton
              following={false}
              onButtonClick={clickFollowButton}
            />
          </div>
        </div>
      ))}
    </>
  );

  const allFollowing = () => (
    <>
      {following.map((person, i) => (
        <div className="card col-lg-3 col-md-4 col-sm-5 mx-sm-auto" key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="pt-2"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={person.name}
          />
          <div className="card-body">
            <h5 className="card-title">{person.name}</h5>
            <p className="card-text">{person.email}</p>
            <Link
              to={`/user/${person._id}`}
              className="btn btn-raised btn-primary float-right"
            >
              <i className="fas fa-eye"></i>
            </Link>
            <FollowProfileButton
              following={following}
              onButtonClick={clickFollowButton}
            />
          </div>
        </div>
      ))}
    </>
  );

  const postsTab = () => (
    <>
      {`${posts.length}     `}
      <i
        className="fab fa-usps"
        style={{
          fontSize: "25px",
          position: "relative",
          height: "50px",
        }}
      >
        <span
          style={{
            position: "absolute",
            height: "20px",
            bottom: "0",
            right: "0",
            left: "0",
            fontSize: "20px",
            width: "200px",
          }}
        >
          <small>Posts</small>
        </span>
      </i>
    </>
  );
  const followersTab = () => (
    <>
      {`${followers.length} `}
      <i
        className="fas fa-user-friends"
        style={{
          fontSize: "25px",
          position: "relative",
          height: "50px",
        }}
      >
        <span
          style={{
            position: "absolute",
            height: "20px",
            bottom: "0",
            right: "0",
            left: "0",
            fontSize: "20px",
          }}
        >
          <small>lowers</small>
        </span>
      </i>
    </>
  );

  const followingTab = () => (
    <>
      {`${following.length}              `}
      <i
        className="fas fa-user-friends"
        style={{
          fontSize: "25px",
          position: "relative",
          height: "50px",
        }}
      >
        <span
          style={{
            position: "absolute",
            height: "20px",
            bottom: "0",
            right: "0",
            left: "0",
            fontSize: "20px",
          }}
        >
          <small>lowing</small>
        </span>
      </i>
    </>
  );

  const { TabPane } = Tabs;

  function callback(key) {
    console.log(key);
  }

  const ProfileTabs = () => (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab={postsTab()} key="1">
        <div className="row">
          <div className="col-sm-12">{allPosts()}</div>
        </div>
      </TabPane>
      <TabPane tab={followersTab()} key="2">
        <div className="row">{allFollowers()}</div>
      </TabPane>
      <TabPane tab={followingTab()} key="3">
        <div className="row">{allFollowing()}</div>
      </TabPane>
    </Tabs>
  );

  return (
    <Fragment>
      <ProfileTabs />
    </Fragment>
  );
};

export default NewProfileTab;
