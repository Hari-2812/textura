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

export const getStoredToken = () => localStorage.getItem("userToken");

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  const hasAuthHeader = Boolean(config.headers?.Authorization);

  if (token && !hasAuthHeader) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (!config.headers?.["Content-Type"] && !(config.data instanceof FormData)) {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      ...error,
      normalizedMessage: message,
      statusCode: error?.response?.status,
    });
  }
);

export default api;
