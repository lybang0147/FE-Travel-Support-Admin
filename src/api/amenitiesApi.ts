import { SearchParams } from "./../types/index";
import axios from "axios";
import Amentity from "models/amenity";
import { ListResponse, GetAllResponse } from "types";
import axiosService from "./axiosClient";
import { AMENITIES } from "./baseURL";

const amenitiesService = {
    getAllAmenities: async (): Promise<GetAllResponse<Amentity>> => {
        return await axios({
          method: "GET",
          url: `${AMENITIES}`,
        })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
      },

      createAmenity: async (data: FormData) => {
        return (await axiosService())({
          method: "POST",
          url: `${AMENITIES}`,
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

      updateAmenity: async (id:string, name: string) => {
        return (await axiosService())({
          method: "PATCH",
          url: `${AMENITIES}/${id}`,
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          params: {name},
        })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
      },

      deleteAmenity: async (id:string) => {
        return (await axiosService())({
          method: "DELETE",
          url: `${AMENITIES}/${id}`
        })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
      },
};


export default amenitiesService;
