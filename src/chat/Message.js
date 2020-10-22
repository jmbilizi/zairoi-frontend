import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuth, getCookie } from "../auth/helpers";
import { read } from "../user/apiUser";

import {
  Row,
  Col,
  UncontrolledTooltip,
  Button,
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

//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
// Import scss
import "./assets/scss/theme.scss";

const Message = ({ userId }) => {
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
      name: "Steven Franklin",
      message: "I am fine, What about you ?",
      time: "10:09",
    },
  ]);
  const [other_Menu, setOther_Menu] = useState(false);
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

  useEffect(() => {
    console.log(userId);
    init(userId);
  }, []);

  console.log(Chat_Box_Username);

  const toggleOther = () => {
    setOther_Menu((prevState) => !prevState.other_Menu);
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
    <div style={{ height: "100%" }} className="user-chat">
      <Card>
        <div className="p-2 border-bottom ">
          <Row>
            <Col md="6" xs="9">
              <h5 className="font-size-15 mb-1 text-left">
                {Chat_Box_Username}
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
            </Col>
            <Col md="6" xs="3">
              <ul className="list-inline user-chat-nav text-right mb-0">
                <li className="list-inline-item pr-4">
                  <Dropdown isOpen={other_Menu} toggle={toggleOther}>
                    <DropdownToggle className="btn nav-btn" tag="i">
                      <i className="bx bx-dots-horizontal-rounded"></i>
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

        <div>
          <div className="chat-conversation">
            <ul className="list-unstyled p-0">
              <PerfectScrollbar style={{ height: "310px" }}>
                <li>
                  <div className="chat-day-title">
                    <span className="title">Today</span>
                  </div>
                </li>
                {messages.map((message) => (
                  <li
                    key={"test_k" + message.id}
                    className={message.isRight ? "right" : "left"}
                  >
                    <div className="conversation-list">
                      <UncontrolledDropdown>
                        <DropdownToggle
                          href="#"
                          className="btn nav-btn"
                          tag="i"
                        >
                          <i className="bx bx-dots-vertical-rounded"></i>
                        </DropdownToggle>
                        <DropdownMenu direction="right">
                          <DropdownItem href="#">Copy</DropdownItem>
                          <DropdownItem href="#">Save</DropdownItem>
                          <DropdownItem href="#">Forward</DropdownItem>
                          <DropdownItem href="#">Delete</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                      <div className="ctext-wrap p-3 ml-0">
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
              </PerfectScrollbar>
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
        </div>
      </Card>
    </div>
  );
};

export default Message;
