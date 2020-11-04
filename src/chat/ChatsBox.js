import React, { useState, useEffect } from "react";
import ChatsModal from "./ChatsModal";
import Chats from "./Chats";

function ChatsBox(auth) {
  // const [showModal, setShowModal] = useState(false);
  // const [reduceModal, setreduceModal] = useState(false);

  // //Modal
  // const togglechatsmodal = () => {
  //   setShowModal(!showModal);
  // };

  // //reduceModal
  // const toggleReduceModal = () => {
  //   setreduceModal(!reduceModal);
  // };

  return (
    <ChatsModal auth={auth}/>
    // <>

    //   <button
    //     //I will add on click event that will send you to a card that allow you to send message to the particular user
    //     onClick={togglechatsmodal}
    //     className="btn btn-primary btn-raised ml-5"
    //   >
    //     {!showModal ? "Message" : "End Chat"}
    //   </button>
    //   {showModal ? (
    //     <ChatsModal>
    //       <Chats />
    //       {reduceModal ? (
    //         <button className="modal-sizer" onClick={toggleReduceModal}>
    //           <i class="fas fa-angle-up"></i>
    //         </button>
    //       ) : (
    //         <button className="modal-sizer" onClick={toggleReduceModal}>
    //           <i class="fas fa-angle-down"></i>
    //         </button>
    //       )}

    //       <button className="modal-close" onClick={togglemodal}>
    //         X
    //       </button>
    //     </ChatsModal>
    //   ) : null}
    // </>
  );
}
export default ChatsBox;
