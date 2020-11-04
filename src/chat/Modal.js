import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
// We get hold of the div with the id modal that we have created in index.html
const modalRoot = document.getElementById("modal");
const Modal = (props) => {
  // We create an element div for this modal
  let element = document.createElement("div");
  element.setAttribute("class", "my-modal");

  useEffect(() => {
    //mount
    modalRoot.appendChild(element);
    //unmount
    return () => {
      modalRoot.removeChild(element);
    };
  });

  return createPortal(props.children, element);
};
export default Modal;
