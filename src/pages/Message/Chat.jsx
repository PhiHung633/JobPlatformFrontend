import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs"

const Chat = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log("Attempting WebSocket connection...");
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket Connected");
        stompClient.subscribe("/topic/messages", (msg) => {
          console.log("New Message:", msg.body);
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });
      },
      onDisconnect: () => console.log("WebSocket Disconnected"),
    });
  
    stompClient.activate();
    setClient(stompClient);
  
    return () => {
      console.log("WebSocket Cleanup");
      if (stompClient) stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (client && input.trim() !== "") {
      const message = { sender: "User", content: input };
      client.publish({
        destination: "/app/chat",
        body: JSON.stringify(message),
      });
      setInput("");
    }
  };

  return (
    <div>
      <h2>Chat App</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;