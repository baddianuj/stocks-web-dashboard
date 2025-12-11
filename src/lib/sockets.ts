import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (tickers: string[]): Socket => {
  if (!socket) {
    console.log("Creating new socket connection...");
    socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });
  }

  if (tickers.length > 0) {
    console.log("Subscribing to tickers:", tickers);
    socket.emit("subscribe", tickers);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};