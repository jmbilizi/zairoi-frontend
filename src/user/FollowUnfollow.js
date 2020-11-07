import React, { useState } from "react";
import { follow, unfollow } from "./apiUser";
import { isAuth, getCookie } from "../auth/helpers";

const FollowUnfollow = ({ user, followClass, unfollowClass }) => {
  const [following, setFollowing] = useState(() => {
    const match = user.followers.find((follower) => {
      // one id has many other ids (followers) and vice versa
      return follower === isAuth()._id;
    });
    return match;
  });

  const token = getCookie("token");
  const userId = isAuth()._id;

  const followClick = () => {
    follow(userId, token, user._id).then((data) => {
      if (data.error) {
        console.log("error");
      } else {
        setFollowing(true);
      }
    });
  };

  const unfollowClick = () => {
    unfollow(userId, token, user._id).then((data) => {
      if (data.error) {
        console.log("error");
      } else {
        setFollowing(false);
      }
    });
  };

  return (
    <div className="d-inline-block">
      {!following ? (
        <div onClick={followClick} className={`${followClass}`}>
          Follow
        </div>
      ) : (
        <div onClick={unfollowClick} className={`${unfollowClass}`}>
          UnFollow
        </div>
      )}
    </div>
  );
};

export default FollowUnfollow;
