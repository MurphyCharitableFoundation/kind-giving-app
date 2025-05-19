import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api";

const token = Cookies.get("authToken");

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiWithoutAuth: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token from cookies
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = Cookies.get("authToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

export const getCauses = async () => {
  try {
    const result = await axios.get(`${API_BASE_URL}/causes`, {
      headers: { Authorization: `Token ${token}` },
    });

    if (!result) throw new Error("Error getting Causes");

    return result;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export { api, apiWithoutAuth };
