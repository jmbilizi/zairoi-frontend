import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
// We get hold of the div with the id modal that we have created in index.html
const modalRoot = document.getElementById("modal");
const Modal = ({ children, reducer }) => {
  // We create an element div for this modal
  let element = document.createElement("div");
  element.setAttribute("class", "my-modal");

  if (reducer === true) {
    element.setAttribute(
      "style",
      "height: 110px; width: 350px; background: #fff; position: absolute; left: auto; right: 80px; top: 0; bottom: 0; margin: auto; box-shadow: 0 5px 10px 2px rgba(195, 192, 192, 0.5); padding: 1px; text-align: center;"
    );
  }

  if (reducer === false) {
    element.setAttribute(
      "style",
      "height: 900px; width: 350px; background: #fff; position: absolute; left: auto; right: 70px; top: 0; bottom: 0; margin: auto; box-shadow: 0 5px 10px 2px rgba(195, 192, 192, 0.5); padding: 1px; text-align: center;"
    );
  }

  useEffect(() => {
    //mount
    modalRoot.appendChild(element);
    //unmount
    return () => {
      modalRoot.removeChild(element);
    };
  });

  return createPortal(children, element);
};
export default Modal;
