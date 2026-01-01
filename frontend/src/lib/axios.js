// import axios from "axios";

// export const axiosInstance = axios.create({
//   // baseURL: "http://localhost:5001/api",
//   baseURL: "https://streamifynew.onrender.com/api", // live

//   withCredentials: true, //send cookies with request
// });

import axios from "axios";

// export const BASE_URL = "https://streamifynew.onrender.com"; ///live
export const BASE_URL = "http://localhost:5001";

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});
