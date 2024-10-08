import axiosInstance from "../axiosInstance"


export const masterApi = {
  getRole() {
    return axiosInstance.get("/user/getRole")
  },
  getFaculty() {
    return axiosInstance.get("/user/getFaculty")
  }
}