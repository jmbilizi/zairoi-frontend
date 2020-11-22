/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isAuth, getCookie } from "../auth/helpers";
import DefaultProfile from "../images/avatar.jpg";

import {
  Row,
  Col,
  Media,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

import { Scrollbars } from "react-custom-scrollbars";

// Import scss
import "./assets/scss/theme.scss";

//Import Images
// import avatar1 from "../images/users/avatar-1.jpg";
import avatar2 from "./assets/images/users/avatar-2.jpg";
import avatar3 from "./assets/images/users/avatar-3.jpg";
import avatar4 from "./assets/images/users/avatar-4.jpg";
import avatar5 from "./assets/images/users/avatar-5.jpg";
import avatar6 from "./assets/images/users/avatar-6.jpg";
import avatar7 from "./assets/images/users/avatar-7.jpg";
import avatar8 from "./assets/images/users/avatar-8.jpg";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [
        {
          id: 1,
          status: "offline",
          image: avatar2,
          name: "Steven Franklin",
          description: "Hey! there I'm available",
          time: "05 min",
          isActive: true,
        },
        {
          id: 2,
          status: "online",
          image: avatar3,
          name: "Adam Miller",
          description: "I've finished it! See you so",
          time: "12 min",
          isActive: false,
        },
        {
          id: 3,
          status: "online",
          image: avatar4,
          name: "Keith Gonzales",
          description: "This theme is awesome!",
          time: "24 min",
          isActive: false,
        },
        {
          id: 4,
          status: "intermediate",
          image: avatar5,
          name: "Jose Vickery",
          description: "Nice to meet you",
          time: "1 hr",
          isActive: false,
        },
        {
          id: 5,
          status: "offline",
          image: avatar6,
          name: "Mitchel Givens",
          description: "Hey! there I'm available",
          time: "3 hrs",
          isActive: false,
        },
        {
          id: 6,
          status: "online",
          image: avatar7,
          name: "Stephen Hadley",
          description: "I've finished it! See you so",
          time: "5 hrs",
          isActive: false,
        },
        {
          id: 7,
          status: "online",
          image: avatar8,
          name: "Keith Gonzales",
          description: "This theme is awesome!",
          time: "24 min",
          isActive: false,
        },
      ],
      groups: [
        { id: 1, image: "G", name: "General" },
        { id: 1, image: "R", name: "Reporting" },
        { id: 1, image: "M", name: "Meeting" },
        { id: 1, image: "A", name: "Project A" },
        { id: 1, image: "B", name: "Project B" },
      ],
      contacts: [
        {
          category: "A",
          child: [
            { id: 1, name: "Adam Miller" },
            { id: 2, name: "Alfonso Fisher" },
          ],
        },
        {
          category: "B",
          child: [{ id: 1, name: "Bonnie Harney" }],
        },
        {
          category: "C",
          child: [
            { id: 1, name: "Charles Brown" },
            { id: 2, name: "Carmella Jones" },
            { id: 3, name: "Carrie Williams" },
          ],
        },
        {
          category: "D",
          child: [{ id: 4, name: "Dolores Minter" }],
        },
      ],
      messages: [
        {
          id: "34",
          isRight: true,
          name: isAuth().name,
          message: "Hello!",
          time: "10:00",
        },
        {
          id: "35",
          isRight: true,
          name: isAuth().name,
          message: "How are you ?",
          time: "10:07",
        },
        {
          id: "36",
          isRight: false,
          name: "Steven Franklin",
          message: "I am fine, What about you ?",
          time: "10:09",
        },
      ],
      notification_Menu: false,
      search_Menu: false,
      settings_Menu: false,
      other_Menu: false,
      activeTab: "1",
      Chat_Box_Username: "Steven Franklin",
      Chat_Box_Username2: isAuth().name,
      Chat_Box_User_Status: "online",
      Chat_Box_User_isActive: false,
      curMessage: "",
    };
    this.toggleNotification = this.toggleNotification.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.toggleOther = this.toggleOther.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.UserChatOpen = this.UserChatOpen.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  toggleNotification() {
    this.setState((prevState) => ({
      notification_Menu: !prevState.notification_Menu,
    }));
  }

  //Toggle Chat Box Menus
  toggleSearch() {
    this.setState((prevState) => ({
      search_Menu: !prevState.search_Menu,
    }));
  }

  toggleSettings() {
    this.setState((prevState) => ({
      settings_Menu: !prevState.settings_Menu,
    }));
  }

  toggleOther() {
    this.setState((prevState) => ({
      other_Menu: !prevState.other_Menu,
    }));
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  //Use For Chat Box
  UserChatOpen = (id, name, status) => {
    let chatModule = [...this.state.chats];

    for (let k = 0; k < 6; k++) {
      chatModule[k].isActive = false;
    } // Enable All Option First
    chatModule[id - 1].isActive = true;

    let msg = [
      {
        id: "39",
        isRight: true,
        name: isAuth().name,
        message: "How are you ?",
        time: "10:07",
      },
      {
        id: "40",
        isRight: false,
        name: name,
        message: "I am fine, What about you ?",
        time: "10:09",
      },
    ];
    this.setState({
      Chat_Box_Username: name,
      Chat_Box_User_Status: status,
      messages: msg,
      chats: chatModule,
    });
  };

  addMessage() {
    let d = new Date();
    var n = d.getSeconds();
    let demoMsg = this.state.messages;
    demoMsg.push({
      isRight: true,
      name: this.state.Chat_Box_Username2,
      message: this.state.curMessage,
      time: "00:" + n,
    });
    this.setState({ messages: demoMsg, curMessage: "" });
  }

  render() {
    const photoUrl = isAuth()._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          isAuth()._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <Col lg="12" className="px-0">
        <div className="px-2 pt-2 border-bottom">
          <Row>
            <Col xs="9">
              <img
                src={photoUrl}
                style={{
                  borderRadius: "50%",
                }}
                className="float-left mr-2"
                height="40px"
                width="40px"
                alt="photo"
              />

              <h5 className="font-size-15 mb-1 text-left btn-link">
                <Link to={`/user/${isAuth()._id}`} className="text-dark">
                  <strong>{isAuth().name}</strong>
                </Link>
              </h5>

              <p className="text-muted mb-0 text-left">
                <i className="mdi mdi-circle text-success align-middle mr-1"></i>{" "}
                Active
              </p>
            </Col>
            <Col xs="3">
              <Media className="text-right">
                <Dropdown
                  isOpen={this.state.notification_Menu}
                  toggle={this.toggleNotification}
                  className="chat-noti-dropdown active pb-0 mb-0"
                >
                  <DropdownToggle className="btn" tag="i">
                    <i className="bx bx-bell bx-tada"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href="#">Action</DropdownItem>
                    <DropdownItem href="#">Another action</DropdownItem>
                    <DropdownItem href="#">Something else here</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Media>
            </Col>
          </Row>
        </div>

        <div className="chat-leftsidebar-nav">
          <Nav pills justified>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "1",
                })}
                onClick={() => {
                  this.toggleTab("1");
                }}
              >
                <i className="bx bx-chat font-size-20 d-sm-none"></i>
                <span className="d-none d-sm-block">Chat</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "2",
                })}
                onClick={() => {
                  this.toggleTab("2");
                }}
              >
                <i className="bx bx-group font-size-20 d-sm-none"></i>
                <span className="d-none d-sm-block">Group</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "3",
                })}
                onClick={() => {
                  this.toggleTab("3");
                }}
              >
                <i className="bx bx-book-content font-size-20 d-sm-none"></i>
                <span className="d-none d-sm-block">Contacts</span>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab} className="py-0">
            <TabPane tabId="1">
              <div className="search-box chat-search-box py-1">
                <div className="position-relative justify-content-center">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </div>
              <div>
                <ul className="list-unstyled chat-list">
                  <Scrollbars style={{ height: "450px" }}>
                    {this.state.chats.map((chat) => (
                      <li
                        key={chat.id + chat.status}
                        className={chat.isActive ? "active" : ""}
                      >
                        <Link
                          to="#"
                          onClick={() => {
                            this.UserChatOpen(chat.id, chat.name, chat.status);
                          }}
                        >
                          <Media>
                            <div className="align-self-center mr-3">
                              <i
                                className={
                                  chat.status === "online"
                                    ? "mdi mdi-circle text-success font-size-10"
                                    : chat.status === "intermediate"
                                    ? "mdi mdi-circle text-warning font-size-10"
                                    : "mdi mdi-circle font-size-10"
                                }
                              ></i>
                            </div>
                            <div className="align-self-center mr-3">
                              <img
                                src={chat.image}
                                className="rounded-circle avatar-xs"
                                alt=""
                              />
                            </div>

                            <Media className="overflow-hidden" body>
                              <h5 className="text-truncate font-size-14 mb-1">
                                {chat.name}
                              </h5>
                              <p className="text-truncate mb-0">
                                {chat.description}
                              </p>
                            </Media>
                            <div className="font-size-11">{chat.time}</div>
                          </Media>
                        </Link>
                      </li>
                    ))}
                  </Scrollbars>
                </ul>
              </div>
            </TabPane>

            <TabPane tabId="2">
              <div className="search-box chat-search-box py-1">
                <div className="position-relative">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </div>
              <ul className="list-unstyled chat-list">
                <Scrollbars style={{ height: "450px" }}>
                  {this.state.groups.map((group) => (
                    <li key={"test" + group.image}>
                      <Link
                        to="#"
                        onClick={() => {
                          this.UserChatOpen(group.name, group.status);
                        }}
                      >
                        <Media className="align-items-center">
                          <div className="avatar-xs mr-3">
                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                              {group.image}
                            </span>
                          </div>

                          <Media body>
                            <h5 className="font-size-14 mb-0">{group.name}</h5>
                          </Media>
                        </Media>
                      </Link>
                    </li>
                  ))}
                </Scrollbars>
              </ul>
            </TabPane>

            <TabPane tabId="3">
              <div className="search-box chat-search-box py-1 text-center">
                <div className="position-relative">
                  <Input
                    type="text"
                    className="form-control "
                    placeholder="Search..."
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </div>
              <div>
                <Scrollbars style={{ height: "450px" }}>
                  {this.state.contacts.map((contact) => (
                    <div
                      key={"test_" + contact.category}
                      className={contact.category === "A" ? "" : "mt-4"}
                    >
                      <div className="avatar-xs mb-3">
                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                          {contact.category}
                        </span>
                      </div>

                      <ul className="list-unstyled chat-list">
                        {contact.child.map((array) => (
                          <li key={"test" + array.id}>
                            <Link
                              to="#"
                              onClick={() => {
                                this.UserChatOpen(array.name, array.status);
                              }}
                            >
                              <h5 className="font-size-14 mb-0">
                                {array.name}
                              </h5>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Scrollbars>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </Col>
    );
  }
}

export default Chat;
