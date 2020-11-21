import React, { useState, useEffect } from "react";
import ChatsModal from "./ChatsModal";
import Chats from "./Chats";

const ChatsBox = ({ auth }) => {
  const [reduceModal, setreduceModal] = useState(true);

  //reduceModal
  const toggleReduceModal = () => {
    setreduceModal(!reduceModal);
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
