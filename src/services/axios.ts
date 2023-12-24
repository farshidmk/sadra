import axios from "axios";

export const BASE_URL = "http://37.32.121.233:9099/api/" || process.env.REACT_APP_API_URL;
export const BASE_URL_V2 = "http://192.168.1.149:8080/api/" || process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiV2 = axios.create({
  baseURL: BASE_URL_V2,
  headers: {
    "Content-Type": "application/json",
  },
});
