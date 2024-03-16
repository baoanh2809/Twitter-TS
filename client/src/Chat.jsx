/**
 * eslint-disable no-undef
 *
 * @format
 */

/** @format */

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
/** @format */
const profile = JSON.parse(localStorage.getItem("profile")) || {};
var socket = io("http://localhost:4000", {
  auth: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
const usernames = [
  {
    name: "Bảo Anh",
    value: "65d9a97ed5fdd26fc42ebe3f",
  },
  {
    name: "Bé Ín",
    value: "65d9aa1cd5fdd26fc42ebe41",
  },
];

const LIMIT = 10;
const PAGE = 1;
export default function Chat() {
  const [value, setValue] = useState("");
  const [conversations, setConversations] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [pagination, setPagination] = useState({
    page: PAGE,
    total_page: 0,
  });
  const getProfile = (username) => {
    axios
      .get(`/api/users/${username}`, {
        baseURL: "http://localhost:4000",
      })
      .then((res) => {
        setReceiver(res.data.result._id);
        alert(`Now chatting with ${res.data.result.name}`);
      });
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      const { payload } = data;
      setConversations((conversations) => [payload, ...conversations]);
    });
    socket.on("connect_error", (err) => {
      console.log(err);
    });
    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (receiver) {
      axios
        .get(`/conversations/receivers/${receiver}`, {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          params: {
            limit: LIMIT,
            page: PAGE,
          },
        })
        .then((res) => {
          const { conversations, page, total_page } = res.data.result;
          setConversations(conversations);
          setPagination({ page, total_page });
        });
    }
  }, [receiver]);

  const fetchMoreConversations = (page) => {
    if (receiver && page <= pagination.total_page) {
      axios
        .get(`/conversations/receivers/${receiver}`, {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          params: {
            limit: LIMIT,
            page: pagination.page + 1,
          },
        })
        .then((res) => {
          const { conversations, page, total_page } = res.data.result;
          setConversations((pre) => [...conversations, ...pre]);
          setPagination({
            page,
            total_page,
          });
        });
    }
  };

  const send = (e) => {
    e.preventDefault();
    setValue("");
    const conversation = {
      content: value,
      sender_id: profile._id,
      receiver_id: receiver,
    };
    socket.emit("send_message", {
      payload: conversation,
    });
    setConversations((conversations) => [
      {
        ...conversation,
        _id: new Date().getTime(),
      },
      ...conversations,
    ]);
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {usernames.map((user) => (
          <div key={user.name}>
            <button onClick={() => getProfile(user.value)}>{user.name}</button>
          </div>
        ))}
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchMoreConversations}
        isReverse={false}
        hasMore={pagination.page < pagination.total_page}
        threshold={5}
      >
        <div
          style={{
            height: 300,
            display: "flex",
            overflow: "auto",
            flexDirection: "column-reverse",
          }}
          id="scrollableDiv"
        >
          {conversations.map((conversation) => {
            return (
              <div key={conversation._id} id={conversation._id}>
                <div className="message-container">
                  <div
                    className={
                      "message " +
                      (conversation.sender_id === profile._id
                        ? "message-right"
                        : "")
                    }
                  >
                    {conversation.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
      <form onSubmit={send}>
        <input
          type="text"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
