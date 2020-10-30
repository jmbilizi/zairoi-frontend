import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import Message from "./Message";

function ToggleModal({ id, name }) {
  const [showModal, setShowModal] = useState(false);

  //Modal
  const togglemodal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <button
        //I will add on click event that will send you to a card that allow you to send message to the particular user
        onClick={togglemodal}
        className="btn btn-primary btn-raised ml-5"
      >
        {!showModal ? "Message" : "End Message"}
      </button>
      {showModal ? (
        <Modal>
          <Message userId={id} userName={name}/>
          <button className="modal-close" onClick={togglemodal}>
            X
          </button>
        </Modal>
      ) : null}
    </>
  );
}
export default ToggleModal;
