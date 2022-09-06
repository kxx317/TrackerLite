import axiosClient from "./axiosClient";

const taskApi = {
  create: (boardId, data) => axiosClient.post(`boards/${boardId}/tasks`, data),
  updatePosition: (boardId, data) =>
    axiosClient.put(`boards/${boardId}/tasks/update-position`, data),
  delete: (boardId, taskId) =>
    axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),
  update: (boardId, taskId, data) =>
    axiosClient.put(`boards/${boardId}/tasks/${taskId}`, data),
};

export default taskApi;
