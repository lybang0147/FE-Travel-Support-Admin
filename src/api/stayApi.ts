import { SearchParams } from "./../types/index";
import axios from "axios";
import Stay from "models/stay";
import { ListResponse, GetAllResponse } from "types";
import axiosService from "./axiosClient";
import { BOOKING, SEARCH_STAY_BY_CRITERIA, STAY } from "./baseURL";
import { Booking } from "models/booking";
const stayService = {
  bookStay: async (book: any): Promise<any> => {
    return await axiosService()({
      method: "POST",
      url: `${BOOKING}`,
      data: book,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  bookStaySuccessfull: async (data: any): Promise<any> => {
    return await axiosService()({
      method: "GET",
      url: `${BOOKING}/pay/success/${data?.id}`,
      params: {
        PayerID: data.PayerID,
        paymentId: data.paymentId,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getBlockedDate: async (id: string): Promise<any> => {
    return await axios({
      method: "GET",
      url: `${BOOKING}/getBlockedDate/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getBookingList: async (): Promise<GetAllResponse<Booking>> => {
    return (await axiosService())({
      method: "GET",
      url: `${BOOKING}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  searchStayByCriteria: async (
    params: SearchParams
  ): Promise<ListResponse<Stay>> => {
    return await axios({
      method: "GET",
      url: `${STAY}/search`,
      params: params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getAllStay: async (): Promise<ListResponse<Stay>> => {
    return await axios({
      method: "GET",
      url: `${STAY}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getStayByID: async (id: string): Promise<ListResponse<Stay>> => {
    return await axios({
      method: "GET",
      url: `${STAY}/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getStayByCriteria: async (
    params: SearchParams
  ): Promise<ListResponse<Stay>> => {
    return await axios({
      method: "GET",
      url: `${SEARCH_STAY_BY_CRITERIA}`,
      params: params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  createStay: async (data: Stay) => {
    return (await axiosService())({
      method: "POST",
      url: `${STAY}`,
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateStay: async (data: Stay) => {
    return (await axiosService())({
      method: "PATCH",
      url: `${STAY}`,
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  deleteStay: async (id: string) => {
    return (await axiosService())({
      method: "DELETE",
      url: `${STAY}`,
      params: {
        ids: id,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  likeStay: async (id: string) => {
    return (await axiosService())({
      method: "POST",
      url: `${STAY}/likeList/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  unLikeStay: async (id: string) => {
    return (await axiosService())({
      method: "POST",
      url: `${STAY}/likeList/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

export default stayService;
