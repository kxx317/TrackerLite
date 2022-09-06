import axiosClient from "./axiosClient";

const sectionApi = {
  create: (boardId) => axiosClient.post(`boards/${boardId}/sections`),
  createTimer: (boardId) =>
    axiosClient.post(`boards/${boardId}/sections/timer`),
  update: (boardId, sectionId, data) =>
    axiosClient.put(`boards/${boardId}/sections/${sectionId}`, data),
  delete: (boardId, sectionId) =>
    axiosClient.delete(`boards/${boardId}/sections/${sectionId}`),
};

export default sectionApi;
