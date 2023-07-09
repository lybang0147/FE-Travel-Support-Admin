import { ROOM_SERVICE } from "./baseURL"
import axiosService from "./axiosClient";
import Service from "models/service";
const serviceRoomService = {
  createRoomService: async (serviceName: string[]) => {
    const params = serviceName.map((name) => `serviceName=${encodeURIComponent(name)}`).join('&');
    return (await axiosService())({
      method: "POST",
      url: `${ROOM_SERVICE}?${params}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
    updateRoomService: async (id: string, data: any) => {
        return (await axiosService())({
          method: "PATCH",
          url: `${ROOM_SERVICE}/${id}`,
          data: data,
        })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
      },
    getAllRoomService: async (): Promise<Service[]> => {
        return (await axiosService())({
            method: "GET",
            url: `${ROOM_SERVICE}/all`,
          })
            .then((res) => res.data)
            .catch((error) => {
              throw error;
            });
    }
}

export default serviceRoomService;