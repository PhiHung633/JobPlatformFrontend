import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/chat'); // Ensure using the correct SockJS URL
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log('Connected');
      // Subscribe to the /topic/messages endpoint
      client.subscribe('/topic/messages', (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    }, (error) => {
      console.error('Connection error:', error); // Handle connection errors
    });

    // Store the stompClient instance in state
    setStompClient(client);

    // Cleanup on component unmount
    return () => {
      if (client) {
        client.disconnect(() => {
          console.log('Disconnected');
        });
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && messageInput.trim()) {
      const chatMessage = {
        sender: 'User',
        content: messageInput,
        type: 'CHAT',
      };

      stompClient.send('/app/sendMessage', {}, JSON.stringify(chatMessage));
      setMessageInput('');
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>{msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
