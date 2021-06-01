import React, { useEffect, useState } from "react";
import { useUser } from "../store";
import { w3cwebsocket as W3CWebSocket } from "websocket";

interface ChatRoomProps {}

const ChatRoom: React.FC<ChatRoomProps> = ({}) => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("vacd");

  const user = useUser();
  useEffect(() => {
    user.actions.fetch();
  }, [])

  
  useEffect(() => {
    var client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/' + room + '/');
    client.onopen = () => {
      console.log("Websocket is connected");
    }
  }, [])
  return <div className="container"></div>;
};

export default ChatRoom;
