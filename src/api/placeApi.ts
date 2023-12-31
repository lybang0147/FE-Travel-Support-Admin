import { SearchParams } from "./../types/index";
import axios from "axios";
import { ListResponse, GetAllResponse } from "types";
import axiosService from "./axiosClient";
import { PLACE, PLACES } from "./baseURL";

import Place from "models/place";
import PlaceAddRequest from "models/request/PlaceAddResquest";
import PlaceUpdateRequest from "models/request/PlaceUpdateRequest";

const placesService = {
    getNearByPlaces: async (lat:number, lng:number): Promise<any> => {
      return await axios({
          method: "GET",
          url: `${PLACES}`,
          params: {
          lat: lat,
          lng: lng,
          },
      })
          .then((res) => res.data)
          .catch((error) => {
          throw error;
          });
    },
    
    searchAllPlace: async (searchKey:string): Promise<Place[]> => {
      return await axios({
        method: "GET",
        url: `${PLACE}/search`,
        params: {
        searchKey: searchKey,
        latitude: 0,
        longitude: 0
        },
    })
        .then((res) => res.data)
        .catch((error) => {
        throw error;
        });
    },
    createPlace: async (data: PlaceAddRequest) => {
      const formData = new FormData();
    formData.append("name", data.name);
    formData.append("addressDescription", data.addressDescription);
    formData.append("type", data.type);
    formData.append("description", data.description);
    formData.append("provinceId", data.provinceId);
    formData.append("timeOpen", data.timeOpen);
    formData.append("timeClose", data.timeClose);
    formData.append("longitude", data.longitude.toString())
    formData.append("latitude", data.latitude.toString())
    formData.append("minPrice",data.minPrice.toString());
    formData.append("maxPrice",data.maxPrice.toString());
    formData.append("recommendTime",data.recommendTime);
  
    data.placeImage.forEach((image) => {
      formData.append("placeImage", image);
    });
      return (await axiosService())({
        method: "POST",
        url: `${PLACE}`,
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        data: formData ,
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    },
    updatePlace: async (data: PlaceUpdateRequest) => {
      const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("addressDescription", data.addressDescription);
    formData.append("description", data.description);
    formData.append("timeOpen", data.timeOpen);
    formData.append("timeClose", data.timeClose);
    formData.append("longitude", data.longitude.toString())
    formData.append("latitude", data.latitude.toString())
    formData.append("minPrice",data.minPrice.toString());
    formData.append("maxPrice",data.maxPrice.toString());
    formData.append("recommendTime",data.recommendTime);
  
    data.placeImage.forEach((image) => {
      formData.append("newImage", image);
    });
    
    data.removedImage.forEach((image) => {
      formData.append("removedImage",image);
    })
      return (await axiosService())({
        method: "PATCH",
        url: `${PLACE}`,
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        data: formData ,
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    },
    getPlaceById: async (placeId: string): Promise<Place> => {
      return await axios({
        method: "GET",
        url: `${PLACE}/${placeId}`,
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    }
};

export default placesService;
