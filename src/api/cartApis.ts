import cookieServices from "../services/cookieServices";
import { axiosInstance } from "./axios.config";
const userEmail = cookieServices.get("user").email;
const token = cookieServices.get("jwt");

export const getCart = async () => {
  try {
    const res = await axiosInstance.get(
      `/carts?populate[products][populate]=*&filters[email][$eq]=${userEmail}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res?.data?.data;
  } catch (error) {
    return error;
  }
};

export const postCart = async (data: object) => {
  try {
    const userEmail = cookieServices.get("user").email;
    const res = await axiosInstance.post(
      `/carts?populate[products][populate]=*&filters[email][$eq]=${userEmail}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res?.data?.data;
  } catch (error) {
    return error;
  }
};

export const putCart = async (id: number, data: object) => {
  try {
    const userEmail = cookieServices.get("user").email;
    const res = await axiosInstance.put(
      `/carts/${id}?populate[products][populate]=*&filters[email][$eq]=${userEmail}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res?.data?.data;
  } catch (error) {
    return error;
  }
};

export const deleteCart = async (id: number) => {
  try {
    const userEmail = cookieServices.get("user").email;
    const res = await axiosInstance.delete(
      `/carts/${id}?populate[products][populate]=*&filters[email][$eq]=${userEmail}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res?.data?.data;
  } catch (error) {
    return error;
  }
};
