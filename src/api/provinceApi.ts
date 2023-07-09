import axios from "axios";
import id from "date-fns/locale/id/index.js";
import Province from "models/province";
import { ListResponse } from "types";
import axiosService from "./axiosClient";
import { PROVINCE } from "./baseURL";

const provinceService = {
  getAllProvince: async (): Promise<ListResponse<Province>> => {
    return await axios({
      method: "GET",
      url: `${PROVINCE}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  createProvince: async (data: FormData) => {
    return (await axiosService())({
      method: "POST",
      url: `${PROVINCE}`,
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getProvince: async (id: string): Promise<any> => {
    return await axios({
      method: "GET",
      url: `${PROVINCE}/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateProvince: async (data: Province) => {
    return (await axiosService())({
      method: "PATCH",
      url: `${PROVINCE}/${id}`,
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateProvinceImg: async (id: string,formData: FormData): Promise<any> => {
    return (await axiosService())({
      method: "POST",
      url: `${PROVINCE}/image/${id}`,
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },


  deleteProvince: async (id: string) => {
    return (await axiosService())({
      method: "DELETE",
      url: `${PROVINCE}/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

export default provinceService;
