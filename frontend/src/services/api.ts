import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 60000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);
