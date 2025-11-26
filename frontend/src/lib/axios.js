import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/api",
  baseURL: "https://streamifynew.onrender.com/api", // live

  withCredentials: true, //send cookies with request
});

//  baseURL: "https://streamifynew.onrender.com/api",
