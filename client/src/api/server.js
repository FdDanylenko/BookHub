import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000",
});

export const serverPrivate = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
