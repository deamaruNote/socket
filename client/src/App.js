// import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io.connect('http://localhost:3001')

function App() {
  const [message, setMessage] = useState();
  const [messageReceived, setMessagerecived] = useState('')
  const sendMessage = () => {
    socket.emit("send_message", {message})
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessagerecived(data.message)
      console.log("aaa")
    });
  }, [socket]);

  return (
    <div className="App">
      <h1>
        { socket.id }
      </h1>
      <br/>
      <input placeholder="input code" onChange={(event) => {
        setMessage(event.target.value)
      }} />
      <button onClick={sendMessage}>Send Message</button>
      <br />
      <div>Message:</div>
      { messageReceived }
    </div>
  );
}

export default App;
