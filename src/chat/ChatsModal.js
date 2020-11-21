import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
// We get hold of the div with the id modal that we have created in index.html
const chatsModalRoot = document.getElementById("chats");

const ChatsModal = ({ children, auth, reducer }) => {
  // We create an element div for this modal
  let element = document.createElement("div");
  element.setAttribute("class", "my-chatsmodal font-weight-bold");

  if (auth === true) {
    if (reducer === true) {
      element.setAttribute(
        "style",
        "height: 110px; width: 320px; background: #fff; position: absolute; left: auto; right: 5px; top: 0; bottom: 0; margin: auto; box-shadow: 0 5px 10px 2px rgba(195, 192, 192, 0.5); padding: 1px; text-align: left"
      );
    }

    if (reducer === false) {
      element.setAttribute(
        "style",
        "height: 1220px; width: 320px; background: #fff; position: absolute; left: auto; right: 5px; top: 0; bottom: 0; margin: auto; box-shadow: 0 5px 10px 2px rgba(195, 192, 192, 0.5); padding: 1px; text-align: left"
      );
    }
  }

  if (auth === false) {
    element.textContent = null;
  }

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
