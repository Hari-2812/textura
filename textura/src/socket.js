// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://textura-z80b.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
});

export default socket;
