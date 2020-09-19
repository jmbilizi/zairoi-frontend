import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
// import antd from "antd";
import "antd/dist/antd.css";
import { Tabs } from "antd";

const NewProfileTab = ({ user, following, followers, posts }) => {
  console.log(posts);

  const allPosts = () => (
    <>
      {posts.map((post, i) => (
        <div key={i}>
          <div>
            <Link to={`/post/${post._id}`}>
              <div>
                <p className="lead text-center">{post.title}</p>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </>
  );

  const allFollowers = () => (
    <>
      {followers.map((person, i) => (
        <div key={i}>
          <div className="">
            <Link to={`/user/${person._id}`}>
              <div>
                <img
                  style={{
                    borderRadius: "50%",
                    border: "1px solid black",
                  }}
                  className="float-left mr-2"
                  height="30px"
                  width="30px"
                  onError={(i) => (i.target.src = `${DefaultProfile}`)}
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                  alt={person.name}
                />
                <div>
                  <p className="lead">{person.name}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </>
  );

  const allFollowing = () => (
    <>
      {following.map((person, i) => (
        <div key={i}>
          <div className="">
            <Link to={`/user/${person._id}`}>
              <div>
                <img
                  style={{
                    borderRadius: "50%",
                    border: "1px solid black",
                  }}
                  className="float-left mr-2"
                  height="30px"
                  width="30px"
                  onError={(i) => (i.target.src = `${DefaultProfile}`)}
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                  alt={person.name}
                />
                <div>
                  <p className="lead">{person.name}</p>
                </div>
              </div>
            </Link>
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
        <div className="row">
          <div className="col-sm-12">{allFollowers()}</div>
        </div>
      </TabPane>
      <TabPane tab={followingTab()} key="3">
        <div className="row">
          <div className="col-sm-12">{allFollowing()}</div>
        </div>
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
