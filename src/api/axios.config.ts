import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mostafa-ecommerce-server-strapi.onrender.com/api",
  // baseURL: "http://localhost:1337/api",
});
