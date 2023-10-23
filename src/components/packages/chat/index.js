import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Media,
} from "reactstrap";
import moment from "moment/moment";
import MyInput from "../../form/MyInput";
import { stringToAvatar, stringToColor } from "../../../helpers/string";
import { AuthContext } from "../../../context/AuthContextProvider";
import { dispatch, useSelector } from "../../../redux/store";
import { sendMessage } from "../../../redux/reducers/chat";
import AXIOS from "../../../helpers/axios";

const Chat = ({ user, packageId }) => {
  const socket = useContext(AuthContext).socket;
  const messages = useSelector((state) =>
    state.chat.list.filter((item) => item.package === packageId)
  );
  const [message, setMessage] = useState("");
  const [opponent, setOpponent] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await AXIOS.get(`/api/users/all`);
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleMessageSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (opponent) {
        socket.emit("message", {
          type: "chat",
          data: {
            msg: message,
            from: user,
            to: opponent,
            date: new Date().toString(),
            package: packageId,
          },
        });
      }
      dispatch(
        sendMessage({
          msg: message,
          from: user,
          to: opponent,
          date: new Date().toString(),
          package: packageId,
        })
      );
      setMessage("");
    },
    [message, opponent, user, socket, packageId]
  );

  const handleInputChange = useCallback(
    ({ target: { value } }) => setMessage(value),
    []
  );

  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-between mb-2">
        <UncontrolledDropdown>
          <DropdownToggle className="m-0 p-0 bg-transparent">
            <UserItem user={opponent} />
          </DropdownToggle>
          <DropdownMenu>
            <UsersList
              select={setOpponent}
              current={opponent}
              me={user}
              users={users}
            />
          </DropdownMenu>
        </UncontrolledDropdown>
        {/* <div>Datetime</div> */}
      </div>
      <div className="border"></div>
      <div className="d-flex flex-column chat-panel p-3 shadow">
        {messages
          .filter(
            (item) =>
              !opponent ||
              opponent._id === item.from._id ||
              opponent._id === item.to._id
          )
          .map((item, key) => (
            <MessageItem key={key} user={user} message={item} />
          ))}
      </div>
      <div className="border"></div>
      <div className="d-flex mt-3">
        <Form onSubmit={handleMessageSubmit} className="w-100">
          <MyInput
            className=""
            icon="media-1_button-play"
            addonType="append"
            value={message}
            onChange={handleInputChange}
          />
        </Form>
      </div>
    </div>
  );
};

const MessageItem = ({ user, message }) => {
  return (
    <>
      {user._id === message.to._id && (
        <div className="mt-2 mb-2 d-flex justify-content-start">
          <Media className="chat-item">
            <div className="flex-shrink-0 mr-3">
              <UserAvatar user={message.from} size={50} />
            </div>
            <div className="flex-grow-1 rounded border shadow p-1">
              <h5 className="mt-2 mb-1">{message.from.name}</h5>
              <span>{message.msg}</span>
            </div>
            <div className="flex-grow-1 h-100">
              <div className="d-flex align-items-end h-100 p-3">
                {moment(new Date(message.date)).format("h:mm A")}
              </div>
            </div>
          </Media>
        </div>
      )}
      {user._id === message.from._id && (
        <div className="mt-2 mb-2 d-flex justify-content-end">
          <Media className="chat-item">
            <div className="flex-grow-1 h-100">
              <div className="d-flex align-items-end h-100 p-3">
                {moment(new Date(message.date)).format("h:mm A")}
              </div>
            </div>
            <div className="flex-grow-1 rounded border shadow p-1 mr-3">
              <h5 className="mt-2 mb-1">{message.to.name}</h5>
              <span>{message.msg}</span>
            </div>
            <div className="flex-shrink-0">
              <UserAvatar user={message.from} size={50} />
            </div>
          </Media>
        </div>
      )}
    </>
  );
};

const UsersList = ({ current, me, select, users = [] }) => {
  return (
    <>
      <UserListItem select={select} />
      {users
        .filter(
          (user) =>
            !(
              (current && user._id === current._id) ||
              (me && user._id === me._id)
            )
        )
        .map((user, key) => (
          <UserListItem user={user} key={key} select={select} />
        ))}
    </>
  );
};

export const UserAvatar = ({ size = 40, user = null, select = null }) => {
  const handleSelectUser = useCallback(() => {
    if (select) select(user);
  }, [user, select]);

  return (
    <div onClick={handleSelectUser} className="cursor-pointer">
      {user && user.avatar ? (
        <img
          alt={user.name + " " + user.email}
          src={`/avatars/${user.avatar}`}
          width={size}
          height={size}
          className="rounded-circle img-thumbnail"
        />
      ) : (
        <svg
          className="bd-placeholder-img rounded-circle img-thumbnail"
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Placeholder: Image"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title>{user ? user.name + " " + user.email : "User"}</title>
          <rect
            width="100%"
            height="100%"
            fill={stringToColor(user ? user.name : "A L")}
          ></rect>
          <text
            x={size / 5}
            y="50%"
            fill="#eee"
            dy=".3em"
            fontSize={size / 2 - size / 5}
          >
            {user ? stringToAvatar(user.name) : "AL"}
          </text>
        </svg>
      )}
    </div>
  );
};

export const UserItem = ({ user = null, select = null, size = 40 }) => {
  return (
    <div className="d-flex">
      <div className="mr-2">
        <UserAvatar user={user} size={size} select={select} />
      </div>
      <div>
        <div className="h-100 d-flex align-items-center">
          <div className="d-flex flex-column">
            <span className="h6">{user ? user.name : "All"}</span>
            {user && <span>user.email</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserListItem = ({ user = null, select = null }) => {
  const handleSelectUser = useCallback(() => {
    if (select) select(user);
  }, [user, select]);

  return (
    <DropdownItem onClick={handleSelectUser}>
      <UserItem user={user} />
    </DropdownItem>
  );
};

export default Chat;
