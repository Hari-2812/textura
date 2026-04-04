import api from "../api";

export const get = async (url, config = {}) => {
  const { data } = await api.get(url, config);
  return data;
};

export const post = async (url, payload = {}, config = {}) => {
  const { data } = await api.post(url, payload, config);
  return data;
};

export const put = async (url, payload = {}, config = {}) => {
  const { data } = await api.put(url, payload, config);
  return data;
};

export const patch = async (url, payload = {}, config = {}) => {
  const { data } = await api.patch(url, payload, config);
  return data;
};

export const del = async (url, config = {}) => {
  const { data } = await api.delete(url, config);
  return data;
};
