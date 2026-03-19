import { io } from "socket.io-client";
import { BACKEND_URL } from "./api";

const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  withCredentials: true,
});

export default socket;
