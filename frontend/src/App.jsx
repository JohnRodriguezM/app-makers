import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import { TextField, Avatar , Paper} from '@mui/material';

const socket = io(import.meta.env.REACT_APP_SOCKET_URL || "/");


export default function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const receiveMessage = useCallback((message) => {
    setMessages(state => [message, ...state]);
  }, []);

  useEffect(() => {
    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [receiveMessage]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
      id: Date.now() // Simple unique identifier
    };
    setMessages(state => [newMessage, ...state]);
    setMessage("");
    socket.emit("message", newMessage.body);
  };

  return (
    <div className="h-screen bg-light-bg text-dark-text flex items-center justify-center">
    <form onSubmit={handleSubmit} className="bg-white p-10">
      <h1 className="text-2xl font-bold my-2">communiMate</h1>

      <TextField
          name="message"
          type="text"
          placeholder="Write your message..."
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          value={message}
          autoFocus
          style={{ background: 'white' }}
        />

<div className="messages-container">
          {messages.map((message, index) => (
            <Paper 
              key={index} 
              className={`my-2 p-2 table text-sm rounded-md ${message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
            }`}
            >
              <div className="message-content">
              <Avatar src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" alt="User" /> {/* Update the path accordingly */}
                <b>{message.from}</b>: {message.body}
              </div>
            </Paper>
          ))}
        </div>
      </form>
    </div>
  );
}