import React, { useState, useEffect } from "react";
import ChatsModal from "./ChatsModal";
import Chats from "./Chats";

const ChatsBox = ({ auth, checkChatReducer }) => {
  const [reduceModal, setreduceModal] = useState(checkChatReducer);

  //reduceModal
  const toggleReduceModal = () => {
    setreduceModal(!reduceModal);
    localStorage.setItem("checkChatReducer", !reduceModal);
  };

  return (
    <ChatsModal auth={auth} reducer={reduceModal}>
      <Chats />
      {reduceModal ? (
        <button className="reducer" onClick={toggleReduceModal}>
          <i className="fas fa-angle-up"></i>
        </button>
      ) : (
        <button className="reducer" onClick={toggleReduceModal}>
          <i className="fas fa-angle-down"></i>
        </button>
      )}
    </ChatsModal>
  );
};
export default ChatsBox;
