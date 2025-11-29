import axios from "./axios";

export const uploadEmployeeAvatar = (employeeId, file) => {
  if (!employeeId || !file) {
    return Promise.resolve();
  }

  const formData = new FormData();
  formData.append("image", file);

  return axios.post(`/img/${employeeId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
