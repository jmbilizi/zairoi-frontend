import React, { Component } from "react";
import { isAuth, getCookie } from "../auth/helpers";
import { Redirect, Link, withRouter } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/apiPost";
import Layout from "../core/Layout";
import Modal from "../Modal";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: [],
      showModal: false,
    };
  }

  //Modal
  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  // check follow
  checkFollow = (user) => {
    const jwt = isAuth();
    const match = user.followers.find((follower) => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt._id;
    });
    return match;
  };

  clickFollowButton = (callApi) => {
    const userId = isAuth()._id;
    const token = getCookie("token");
    // const token = isAuth().token;

    callApi(userId, token, this.state.user._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  init = (userId) => {
    // const token = isAuth().token;
    const token = getCookie("token");

    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = (userId) => {
    const token = getCookie("token");
    // const token = isAuth().token;
    listByUser(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user, posts, showModal } = this.state;
    if (redirectToSignin) return <Redirect to="/signin" />;

    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <Layout>
        <div className="container">
          {/* <h2 className="mt-5 mb-2">Profile</h2> */}
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <img
                style={{ borderRadius: "50%", height: "200px", width: "auto" }}
                className="img-thumbnail"
                src={photoUrl}
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
                alt={user.name}
              />
            </div>

            <div className="col-md-8 col-sm-12">
              <div className="lead mt-2">
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>{`Joined: ${new Date(user.created).toDateString()}`}</p>
              </div>

              {isAuth() && isAuth()._id === user._id ? (
                <div className="d-inline-block">
                  <Link
                    className="btn btn-raised btn-success mr-2"
                    data-toggle="tooltip"
                    data-placement="left"
                    title="Edit your profile"
                    to={`/user/edit/${user._id}`}
                  >
                    <i className="fas fa-2x fa-user-edit"></i>
                  </Link>
                  <DeleteUser userId={user._id} />
                  <Link
                    className="btn btn-raised btn-info ml-2"
                    data-toggle="tooltip"
                    data-placement="left"
                    title="Add a new post"
                    to={`/post/create`}
                  >
                    <i className="fas fa-2x fa-plus"></i>
                    Post
                  </Link>
                  <Link
                    className="btn btn-raised btn-info ml-2"
                    data-toggle="tooltip"
                    data-placement="left"
                    title="Add a new product"
                    to={`/create/product`}
                  >
                    <i className="fas fa-2x fa-plus"></i>
                    Product
                  </Link>
                </div>
              ) : (
                <>
                  <FollowProfileButton
                    following={this.state.following}
                    onButtonClick={this.clickFollowButton}
                  />
                  <React.Fragment>
                    <button
                      //I will add on click event that will send you to a card that allow you to send message to the particular user
                      onClick={this.toggleModal}
                      className="btn btn-primary btn-raised ml-5"
                    >
                      {!showModal ? "Message" : "End Message"}
                    </button>
                    {showModal ? (
                      <Modal>
                        <h1>Message</h1>
                        <p>
                          George Floyd was murdered over potentially using a
                          counterfeit $20 bill. As a white woman, would my $20
                          bill ever be called into question? As a white woman,
                          would I have to fear if the police are called? As a
                          white woman, would I be murdered over a hunch? The
                          answer to all of these questions is “NO.” However, it
                          is a different story for Janvier.
                        </p>
                        <button
                          className="modal-close"
                          onClick={this.toggleModal}
                        >
                          X
                        </button>
                      </Modal>
                    ) : null}
                  </React.Fragment>
                </>
              )}

              <div>
                {isAuth() && isAuth().role === "admin" && (
                  <div className="card mt-5">
                    <div className="card-body">
                      <h5 className="card-title">Admin</h5>
                      <p className="mb-2 text-danger">
                        Edit/Delete as an Admin
                      </p>
                      <Link
                        className="btn btn-raised btn-success mr-3"
                        to={`/user/edit/${user._id}`}
                      >
                        <i className="fas fa-2x fa-user-edit"></i>
                      </Link>
                      <DeleteUser userId={user._id} />
                      {/* <DeleteUser /> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 nav-tabs mt-2">
              <p className="lead text-center">
                <hr />
                {user.about}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 p-0">
              {/* <ProfileTabs
                followers={user.followers}
                posts={posts}
                following={user.following}
              /> */}
              <ProfileTabs
                user={user}
                followers={user.followers}
                posts={posts}
                following={user.following}
              />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default withRouter(Profile);
