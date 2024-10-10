import axiosInstance from "../axiosInstance";

interface FacultyData {
    name: string;
    
  }

export const getAllFaculty = async () => {
    const response = await axiosInstance.get("faculty/listFaculty");
    return  response.data;
}

export const createFaculty = async (facultyData: FacultyData) => {
    const response = await axiosInstance.post("faculty/createFaculty", facultyData);
    return response.data;
}

export const updateFaculty = async (facultyData: FacultyData, id: string) => {
    const response = await axiosInstance.put(`faculty/update/${id}`, facultyData);
    return response.data;
}