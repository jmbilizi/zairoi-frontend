import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { isAuth } from "../auth/helpers";

import SinglePost from "../post/SinglePost";
// import antd from "antd";
import "antd/dist/antd.css";
import { Tabs } from "antd";

//import user's shop
import ShopByUser from "../shop/ShopByUser";
import ManagerProductsByUser from "../seller/ManageProductsByUser";

const NewProfileTab = ({ user, following, followers, posts }) => {
  const allPosts = () => (
    <>
      {posts.reverse().map((post, i) => (
        <div key={i}>{<SinglePost postId={post._id} />}</div>
      ))}
    </>
  );

  const allFollowers = () => (
    <>
      {followers.map((person, i) => (
        <div className="card col-lg-2 col-md-3 col-sm-6 mx-auto" key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="pt-2 rounded-circle"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={person.name}
          />
          <div className="card-body">
            <h5 className="card-title">{person.name}</h5>
            <p className="card-text">{person.email}</p>
            <Link
              to={`/user/${person._id}`}
              className="btn btn-raised btn-primary justtify-content-center"
            >
              <i className="fas fa-eye"></i> View
            </Link>
            {/* <FollowProfileButton
              following={false}
              onButtonClick={clickFollowButton}
            /> */}
          </div>
        </div>
      ))}
    </>
  );

  const allFollowing = () => (
    <>
      {following.map((person, i) => (
        <div className="card col-lg-2 col-md-3 col-sm-4 mx-sm-auto" key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="pt-2 rounded-circle"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={person.name}
          />
          <div className="card-body">
            <h5 className="card-title">{person.name}</h5>
            <p className="card-text">{person.email}</p>
            <Link
              to={`/user/${person._id}`}
              className="btn btn-raised btn-primary"
            >
              <i className="fas fa-eye"></i> View
            </Link>
            {/* <FollowProfileButton
              following={following}
              onButtonClick={clickFollowButton}
            /> */}
          </div>
        </div>
      ))}
    </>
  );

  const { TabPane } = Tabs;

  function callback(key) {
    console.log(key);
  }

  const ProfileTabs = () => (
    <Tabs defaultActiveKey="1" onChange={callback} centered>
      <TabPane tab={`${posts.length} Posts`} key="1">
        <div className="row">
          <div className="col-sm-12">{allPosts()}</div>
        </div>
      </TabPane>
      <TabPane tab="Shop" key="4">
        <div className="row">{<ShopByUser userId={user._id} />}</div>
      </TabPane>
      <TabPane tab={`${followers.length} Followers`} key="2">
        <div className="row">{allFollowers()}</div>
      </TabPane>
      <TabPane tab={`${following.length} Following`} key="3">
        <div className="row">{allFollowing()}</div>
      </TabPane>
      {isAuth() && (isAuth()._id === user._id || isAuth().role === "admin") ? (
        <TabPane tab="MG Products" key="5">
          {<ManagerProductsByUser userId={user._id} />}
        </TabPane>
      ) : (
        false
      )}
    </Tabs>
  );

  return (
    <Fragment>
      <ProfileTabs />
    </Fragment>
  );
};

export default NewProfileTab;
