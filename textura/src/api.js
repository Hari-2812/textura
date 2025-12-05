// src/api.js
import axios from "axios";

export const API_URL = "https://textura-z80b.onrender.com";

export const api = axios.create({
  baseURL: API_URL + "/api",
});
