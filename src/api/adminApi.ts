import { SearchParams } from "./../types/index";
import axios from "axios";
import User from "models/user";
import { ListResponse, GetAllResponse } from "types";
import axiosService from "./axiosClient";
import { USER } from "./baseURL";

const adminService = {
    getListUserInfo: async (searchKey?: string): Promise<User[]> => {
        return (await axiosService())({
          method: "GET",
          url: `${USER}/listUserInfo`,
          params: {searchKey},
        })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
      },
}

export default adminService;
