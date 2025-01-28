import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api";

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

export { api, apiWithoutAuth };
