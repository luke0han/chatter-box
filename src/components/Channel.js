import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import { useFirestoreQuery } from "../hooks";
// Components
import Message from "./Message";

const Channel = ({ user = null }) => {
  const db = firebase.firestore();
  const messagesRef = db.collection("messages");
  const messages = useFirestoreQuery(
    messagesRef.orderBy("createdAt").limit(100)
  );

  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef();

  const { uid, displayName, photoURL } = user;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ smooth: true });
    }
  });

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
      messagesRef.add({
        text: trimmedMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        displayName,
        photoURL,
      });
      // Clear input field
      setNewMessage("");
    }
  };

  return (
    <>
      <div className="dark:border-t dark:border-white border-t border-black overflow-auto h-full">
        <div className="py-0 max-w-screen-lg mx-auto">
          <div className="bg-white dark:bg-black dark:border-gray-600 border-gray-200 py-8 mb-4">
            <div className="bg-white dark:bg-black font-bold text-3xl text-center">
              <p className="bg-white dark:bg-black mb-3">ChatterBox</p>
            </div>
            <p className="bg-white dark:bg-black text-gray-400 text-center">
              This is the beginning of this chat.
            </p>
          </div>
          <ul>
            {messages?.map((message) => (
              <li className="bg-white dark:bg-black" key={message.id}>
                <Message {...message} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white mb-6 mx-0">
        <form
          onSubmit={handleOnSubmit}
          className="border-t-2 border-white bg-white flex flex-row bg-gray-200 dark:bg-gray-900 rounded-md px-4 py-3 z-10 max-w-screen-lg mx-auto dark:text-white shadow-md"
        >
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleOnChange}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage}
            className="uppercase font-semibold text-sm tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};
Channel.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};
export default Channel;