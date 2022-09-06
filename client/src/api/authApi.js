import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
  verifyToken: () => axiosClient.get("/auth/verifyToken"),
};

export default authApi;
