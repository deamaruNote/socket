import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

// 設定主 Socket API 和備用的 Socket API
const mainSocketURL = 'http://localhost:3001';
const backupSocketURL = 'http://localhost:3000/backup-socket';

function App() {
  const [message, setMessage] = useState();
  const [messageReceived, setMessagerecived] = useState('');
  const [socket, setSocket] = useState(null);

  const sendMessage = () => {
    if (socket) {
      socket.emit("send_message", { message });
    }
  }

  useEffect(() => {
    // 嘗試連接主 API
    let socketConnection = io.connect(mainSocketURL);

    // 處理錯誤時，切換到備用 API
    socketConnection.on('connect_error', (error) => {
      console.warn('Main socket connection failed, switching to backup...', error);
      socketConnection = io.connect(backupSocketURL);
    });

    // 設定 socket 事件接收訊息
    socketConnection.on("receive_message", (data) => {
      setMessagerecived(data.message);
    });

    // 設定socket
    setSocket(socketConnection);

    // 清除連接
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>
        { socket ? socket.id : 'No Socket Connected' }
      </h1>
      <br />
      <input 
        placeholder="Input code" 
        onChange={(event) => setMessage(event.target.value)} 
      />
      <button onClick={sendMessage}>Send Message</button>
      <br />
      <div>Message:</div>
      { messageReceived }
    </div>
  );
}

export default App;
