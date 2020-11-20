import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
// We get hold of the div with the id modal that we have created in index.html
const chatsModalRoot = document.getElementById("chats");

const ChatsModal = ({ children, auth }) => {
  // We create an element div for this modal
  let element = document.createElement("div");
  element.setAttribute("class", "my-chatsmodal py-4 font-weight-bold");

  if (auth === true) {
    element.setAttribute(
      "style",
      "height: 70px; width: 70px; background: #fff; border-radius: 40%; position: absolute; left: auto; right: 1px; top: auto; bottom: 40px; margin: auto; box-shadow: 0 5px 10px 2px rgba(195, 192, 192, 0.5); text-align: center;"
    );
    let i = document.createElement("i");
    i.setAttribute("class", "fas fa-chalkboard-teacher fa-2x");
    element.appendChild(i);
  }

  if (auth === false) {
    chatsModalRoot.textContent = null;
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
