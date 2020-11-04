import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { isAuth, getCookie } from "../auth/helpers";
import "./Modal.css";
// We get hold of the div with the id modal that we have created in index.html
const chatsModalRoot = document.getElementById("chats");

const ChatsModal = ({ children, auth }) => {
  // We create an element div for this modal
  let element = document.createElement("div");
  element.setAttribute("class", "my-chatsmodal");

  if (auth === true) {
    chatsModalRoot.textContent = (
      <i
        className="fas fa-chalkboard-teacher"
        style={{ fontSize: "30px", color: "black" }}
      ></i>
    );
  }

  if (auth === false) {
    chatsModalRoot.textContent = "Chats";
  }

  // if (reducer === true) {
  //   element.setAttribute(
  //     "style",
  //     "height: 110px; width: 310px; background: #fff; position: absolute; left: auto; right: 70px; top: 0; bottom: 0; margin: auto; box-shadow: 0 5px 10px 2px rgba(195, 192, 192, 0.5); padding: 1px; text-align: center;"
  //   );
  // }

  // if (reducer === false) {
  //   element.setAttribute(
  //     "style",
  //     "height: 900px; width: 350px; background: #fff; position: absolute; left: auto; right: 70px; top: 0; bottom: 0; margin: auto; box-shadow: 0 5px 10px 2px rgba(195, 192, 192, 0.5); padding: 1px; text-align: center;"
  //   );
  // }

  useEffect(() => {
    //mount
    chatsModalRoot.appendChild(element);
    //unmount
    return () => {
      chatsModalRoot.removeChild(element);
    };
  });

  return createPortal(children, element);
};
export default ChatsModal;
