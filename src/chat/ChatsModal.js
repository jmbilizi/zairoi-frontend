import React from "react";
import { createPortal } from "react-dom";
// import "./Modal.css";
// We get hold of the div with the id modal that we have created in index.html
const chatsModalRoot = document.getElementById("chats");
const theChats = document.createElement("div");
theChats.setAttribute("class", "my-chats");

const i = document.createElement("i");
i.setAttribute("class", "fas fa-chalkboard-teacher");
i.setAttribute("style", "font-size: 30px; color: black");

theChats.append(i);

class ChatsModal extends React.Component {
  constructor(props) {
    super(props);
    // We create an element div for this modal
    this.element = document.createElement("div");
    this.element.setAttribute("class", "my-chats");
    //e.setAttribute("class", `saveBtn${time[i]}`);
  }
  // We append the created div to the div#modal
  componentDidMount() {
    modalRoot.appendChild(this.element);
  }
  /**
   * We remove the created div when this Modal Component is unmounted
   * Used to clean up the memory to avoid memory leak
   */
  componentWillUnmount() {
    modalRoot.removeChild(this.element);
  }
  render() {
    return createPortal(this.props.children, this.element);
  }
}
export default ChatsModal;
