import axios from "axios";

const DEFAULT_BACKEND_URL = "http://localhost:5000";

const normalizeBaseUrl = (url) => {
  if (!url) return DEFAULT_BACKEND_URL;
  return url.replace(/\/+$/, "");
};

const normalizePath = (path = "") => {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
};

export const BACKEND_URL = normalizeBaseUrl(process.env.REACT_APP_API_URL);
export const API_URL = `${BACKEND_URL}/api`;

export const buildApiUrl = (path = "") => `${API_URL}${normalizePath(path)}`;
export const buildBackendUrl = (path = "") => `${BACKEND_URL}${normalizePath(path)}`;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
