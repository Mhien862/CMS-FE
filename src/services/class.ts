import axiosInstance from "../axiosInstance";

interface ClassData {
    name: string;
    faculty_id: string;
    teacher_id: string;
    password: string;
  }

export const getAllClass = async () => {
    const response = await axiosInstance.get("class/listClasses");
    return  response.data;
}

export const getListTeacher = async () => {
    const response = await axiosInstance.get("user/listTeacher");
    return  response.data;
}

export const createClass = async (data: ClassData) => {
    const response = await axiosInstance.post("class/create", data);
    return response.data;
}

export const getClassById = async (id: string) => {
    const response = await axiosInstance.get(`class/${id}`);
    return response.data;
}

export const updateClass = async (id: string, data: ClassData) => {
    const response = await axiosInstance.put(`class/updateClass/${id}`, data);
    return response.data;
}

export const deleteClass = async (id: string) => {
    const response = await axiosInstance.delete(`class/deleteClass/${id}`);
    return response.data;
}