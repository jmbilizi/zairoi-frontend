import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { isAuth, getCookie } from "../auth/helpers";
import { read } from "../user/apiUser";
import DefaultProfile from "../images/avatar.jpg";

import {
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  Button,
  Media,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Card,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";

import { Scrollbars } from "react-custom-scrollbars";
// Import scss
import "./assets/scss/theme.scss";

const Message = ({ userId, userName }) => {
  const [messages, setMessages] = useState([
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
      name: userName,
      message: "I am fine, What about you ?",
      time: "10:09",
    },
  ]);
  const [other_Menu, setOther_Menu] = useState(false);
  const [search_Menu, setSearch_Menu] = useState(false);
  const [Chat_Box_Username, setChat_Box_Username] = useState("");
  const [Chat_Box_Username2, setChat_Box_Username2] = useState("");
  const [Chat_Box_User_Status, setChat_Box_User_Status] = useState("");
  const [curMessage, setCurMessage] = useState("");

  //read user's data
  const init = (userId) => {
    // const token = isAuth().token;
    const token = getCookie("token");

    read(userId, token).then((data) => {
      if (data.error) {
        console.log("user not found");
      } else {
        console.log(data.name);
        setChat_Box_Username(data.name);
        setChat_Box_User_Status("online");
        setChat_Box_Username2(isAuth().name);
      }
    });
  };
  console.log(userId);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, init(userId), []);

  console.log(Chat_Box_Username);

  const toggleOther = () => {
    setOther_Menu(!other_Menu);
  };

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setSearch_Menu(!search_Menu);
  };

  const addMessage = () => {
    let d = new Date();
    var n = d.getSeconds();
    let demoMsg = messages;
    demoMsg.push({
      isRight: true,
      name: Chat_Box_Username2,
      message: curMessage,
      time: "00:" + n,
    });
    setMessages(demoMsg);
    setCurMessage("");
  };

  return (
    <Col lg="12" className="px-0 mb-0">
      {/* <div className="d-lg-flex">
        <div style={{ height: "100%" }} className="user-chat"> */}
      <Card>
        <div className="p-2 border-bottom ">
          <Row>
            <Col xs="7">
              <img
                style={{
                  borderRadius: "50%",
                }}
                className="float-left mr-2"
                height="40px"
                width="40px"
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
                src={`${process.env.REACT_APP_API_URL}/user/photo/${userId}`}
                alt="userName"
              />
              <>
                <h5 className="font-size-13 mb-1 text-left btn-link">
                  <Link to={`/user/${userId}`} className="text-dark">
                    <strong>{Chat_Box_Username}</strong>
                  </Link>
                </h5>
                <p className="text-muted mb-0 text-left">
                  <i
                    className={
                      Chat_Box_User_Status === "online"
                        ? "mdi mdi-circle text-success align-middle mr-1"
                        : Chat_Box_User_Status === "intermediate"
                        ? "mdi mdi-circle text-warning align-middle mr-1"
                        : "mdi mdi-circle align-middle mr-1"
                    }
                  ></i>
                  {Chat_Box_User_Status}
                </p>
              </>
            </Col>
            <Col xs="5">
              <ul className="list-inline user-chat-nav text-right mb-0 pr-5">
                <li className="list-inline-item">
                  <Dropdown isOpen={search_Menu} toggle={toggleSearch}>
                    <DropdownToggle
                      onMouseEnter={(i) =>
                        (i.target.style.background = "#f5f5f5")
                      }
                      onMouseLeave={(i) => (i.target.style.background = "none")}
                      style={{
                        marginTop: "3px",
                        paddingLeft: "6px",
                        paddingRight: "3px",
                      }}
                      className="btn"
                      tag="i"
                    >
                      <i class="fas fa-search"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-md" right>
                      <Form className="p-3">
                        <FormGroup className="m-0">
                          <InputGroup>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Search ..."
                              aria-label="Recipient's username"
                            />
                            <InputGroupAddon addonType="append">
                              <Button color="primary" type="submit">
                                <i className="mdi mdi-magnify"></i>
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Form>
                    </DropdownMenu>
                  </Dropdown>
                </li>
                <li className="list-inline-item">
                  <Dropdown isOpen={other_Menu} toggle={toggleOther}>
                    <DropdownToggle
                      onMouseEnter={(i) =>
                        (i.target.style.background = "#f5f5f5")
                      }
                      onMouseLeave={(i) => (i.target.style.background = "none")}
                      style={{
                        marginTop: "3px",
                        paddingLeft: "6px",
                        paddingRight: "6px",
                      }}
                      className="btn"
                      tag="i"
                    >
                      <i className="fas fa-ellipsis-h"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem href={`/user/${userId}`}>
                        View Profile
                      </DropdownItem>
                      <DropdownItem href="#">Muted</DropdownItem>
                      <DropdownItem href="#">Delete</DropdownItem>
                      <DropdownItem href="#">Action</DropdownItem>
                      <DropdownItem href="#">Report</DropdownItem>
                      <DropdownItem href="#">Another Action</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="chat-conversation">
          <ul className="list-unstyled p-0 my-0">
            <Scrollbars
              style={{
                height: "332px",
              }}
            >
              <li>
                <div className="chat-day-title py-0 my-0">
                  <span className="title">Today</span>
                </div>
              </li>
              {messages.map((message) => (
                <li
                  key={"test_k" + message.id}
                  className={
                    message.isRight ? "text-right pr-3" : "text-left pl-2"
                  }
                >
                  <div className="conversation-list">
                    <UncontrolledDropdown
                      className={message.isRight ? "float-left" : "float-right"}
                    >
                      <DropdownToggle href="#" className="btn nav-btn" tag="i">
                        <i className="bx bx-dots-vertical-rounded"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem href="#">Copy</DropdownItem>
                        <DropdownItem href="#">Save</DropdownItem>
                        <DropdownItem href="#">Forward</DropdownItem>
                        <DropdownItem href="#">Delete</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="ctext-wrap p-3">
                      <div
                        className={`conversation-name ${
                          message.isRight ? "text-right" : "text-left"
                        }`}
                      >
                        {message.name}
                      </div>
                      <p>{message.message}</p>
                      <p
                        className={`chat-time mb-0 ${
                          message.isRight ? "text-right" : "text-left"
                        }`}
                      >
                        <i className="bx bx-time-five align-left"></i>
                        {message.time}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </Scrollbars>
          </ul>
        </div>
        <div className="p-2 chat-input-section">
          <Row>
            <Col>
              <div className="position-relative">
                <input
                  type="text"
                  value={curMessage}
                  onChange={(e) => {
                    setCurMessage(e.target.value);
                  }}
                  className="form-control chat-input"
                  placeholder="Enter Message..."
                />
                <div className="chat-input-links">
                  <ul className="list-inline mb-0">
                    <li className="list-inline-item">
                      <Link to="#">
                        <i
                          className="mdi mdi-emoticon-happy-outline"
                          id="Emojitooltip"
                        ></i>
                        {/* <UncontrolledTooltip
                                      placement="top"
                                      target="Emojitooltip"
                                    >
                                      Emojis
                                    </UncontrolledTooltip> */}
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <label>
                        <i
                          className="mdi mdi-file-image-outline"
                          id="Imagetooltip"
                        ></i>
                        {/* <UncontrolledTooltip
                                      placement="top"
                                      target="Imagetooltip"
                                    >
                                      Images
                                    </UncontrolledTooltip> */}
                        <input type="file" hidden />
                      </label>
                    </li>
                    <li className="list-inline-item">
                      <Link to="#">
                        <i
                          className="mdi mdi-file-document-outline"
                          id="Filetooltip"
                        ></i>
                        {/* <UncontrolledTooltip
                                      placement="top"
                                      target="Filetooltip"
                                    >
                                      Add Files
                                    </UncontrolledTooltip> */}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col className="col-auto">
              <Button
                type="button"
                color="primary"
                onClick={addMessage}
                className="btn-rounded chat-send waves-effect waves-light"
              >
                <span className="d-none d-sm-inline-block"></span>
                <i className="mdi mdi-send"></i>
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
      {/* </div>
      </div> */}
    </Col>
  );
};

export default Message;
