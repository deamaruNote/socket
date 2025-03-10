package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gorilla/websocket"
	"github.com/gorilla/mux"
)

// WebSocket 升級器，用來升級 HTTP 連接為 WebSocket
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// 設定 CORS，允許來自 http://localhost:3000/backup-socket 的請求
		return r.Header.Get("Origin") == "http://localhost:3000/backup-socket"
	},
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	// 升級 HTTP 連接為 WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade connection:", err)
		return
	}
	defer conn.Close()

	log.Println("Client Connected:", conn.RemoteAddr())

	for {
		// 接收來自客戶端的訊息
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Failed to read message:", err)
			break
		}

		// 顯示收到的訊息
		fmt.Println("收到訊息:", string(msg))

		// 向其他客戶端廣播訊息
		for _, client := range clients {
			if client != conn {
				err := client.WriteMessage(websocket.TextMessage, msg)
				if err != nil {
					log.Println("Failed to send message:", err)
				}
			}
		}

		// 回應發送給本端客戶端的訊息
		err = conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Println("Failed to send message:", err)
			break
		}
	}
}

var clients []*websocket.Conn

func main() {
	r := mux.NewRouter()

	// 設定 WebSocket 處理器，將 API 改為 /backup-socket/ws
	r.HandleFunc("/backup-socket/ws", handleWebSocket)

	// 設定 CORS，允許來自 http://localhost:3000/backup-socket 的請求
	r.Use(corsMiddleware)

	// 啟動伺服器，將端口改為 3002
	http.Handle("/", r)
	log.Println("Server running on http://localhost:3002")
	err := http.ListenAndServe(":3002", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

// CORS 中間件，允許來自 http://localhost:3000/backup-socket 的請求
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000/backup-socket")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		next.ServeHTTP(w, r)
	})
}
