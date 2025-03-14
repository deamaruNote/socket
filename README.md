# CORS Describe

```plaintext
+------------------+       CORS       +------------------+        備用後端 API        +---------------------+
|  前端 (Port 3000) |  ------------>   |   後端 (Port 3001)|  -------------------->   |  備用後端 (Port 3002)|
|   (React App)    |  (允許來自3000)    |  (Socket.io伺服器)|    (Socket.io伺服器)      |    (備用伺服器)       |
+------------------+                   +------------------+                          +---------------------+
         ↑                                      ↓                                               ↓
    發送請求: 跨域請求                      回傳訊息: 即時通訊                                備用伺服器處理請求
      (Request)                             (Response)                                     (Response)
```

# Dev build
| 項目            | React 客戶端 (client)               | Node 伺服器 (server)                 | Golang 伺服器(backup)       |
|-----------------|-----------------------------------|--------------------------------------|---------------------------|
| **啟動指令**     | `npm run start`                   | `npm start`                          | `go run main.go`       |
| **描述**         | 啟動 React 應用程式，並在本機執行。   | 啟動 Node.js 伺服器，並提供後端服務。  | 啟動 Golang 伺服器，並提供後端服務。|
| **阜號**         | 預設端口 3000                    | 預設端口 3001                        | 預設端口 3002         |
| **功能**         | 提供前端使用者介面，並向伺服器發送請求。| 伺服器提供即時訊息的功能 (例如 Socket.io)。| 提供即時訊息的後端服務，支援 WebSocket 或其他通訊協議。|
| **Package**       | React.js、Node.js、Socket.io     | Node.js、Express、Socket.io         | Golang、Socket.io (或其他庫) |
| **啟動後的操作** | 在瀏覽器中運行 React 應用。       | 啟動後可以接受來自 React 客戶端的請求。  | 啟動後可以接受來自客戶端的 WebSocket 請求，並處理即時通訊。 |

# Remark Git
- GitHub 
- GitLab CICD