import axiosInstance from "../axiosInstance";

interface ClassData {
    name: string;
    faculty_id: string;
    teacher_id: string;
    password: string;
  }

  interface FolderData {
    name: string;
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

export const getClassesByTeacherId = async (teacherId) => {
    const response = await axiosInstance.get(`class/teacher/${teacherId}`);
    return response.data;
  };


export const teacherCheckClass = async (teacherId ,classId) => {
    const response = await axiosInstance.post("class/teacherCheckClass", { teacherId, classId });
    return response.data;
};

export const createFolder = async (classId: string | number, data: FolderData) => {
    if (typeof classId === 'object') {
        throw new Error('Invalid classId provided');
    }
    const response = await axiosInstance.post(`class/${classId}/createFolder`, data);
    return response.data;
};

export const getFoldersByClassId = async (classId) => {
    try {
      const response = await axiosInstance.get(`/class/${classId}/folders`);  
      if (response.data && response.data.folders) {
        return response.data.folders;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Unexpected data structure from API");
      }
    } catch (error) {
      throw error;
    }
  };