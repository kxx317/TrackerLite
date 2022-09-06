import axiosClient from "./axiosClient";

const boardApi = {
  create: (data) => axiosClient.post("/boards", data),
  getAll: () => axiosClient.get("/boards"),
  updatePosition: (data) => axiosClient.put("/boards", data),
  delete: (id) => axiosClient.delete(`boards/${id}`),
  getContent: (id) => axiosClient.get(`boards/${id}`),
  update: (id, data) => axiosClient.put(`boards/${id}`, data),
  getFavourites: () => axiosClient.get("boards/favourites"),
  updateFavouritePosition: (data) => axiosClient.put("boards/favourites", data),
};

export default boardApi;
