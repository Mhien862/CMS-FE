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

interface AssignmentData {
  title: string;
  description: string;
  file?: File;
}

interface GradeData {
  grade: number;
}

export const getAllClass = async () => {
  const response = await axiosInstance.get("class/listClasses");
  return response.data;
};

export const getListTeacher = async () => {
  const response = await axiosInstance.get("user/listTeacher");
  return response.data;
};

export const createClass = async (data: ClassData) => {
  const response = await axiosInstance.post("class/create", data);
  return response.data;
};

export const getClassById = async (id: string) => {
  const response = await axiosInstance.get(`class/${id}`);
  return response.data;
};

export const updateClass = async (id: string, data: ClassData) => {
  const response = await axiosInstance.put(`class/updateClass/${id}`, data);
  return response.data;
};

export const deleteClass = async (id: string) => {
  const response = await axiosInstance.delete(`class/deleteClass/${id}`);
  return response.data;
};

export const getClassesByTeacherId = async (teacherId: string) => {
  const response = await axiosInstance.get(`class/teacher/${teacherId}`);
  return response.data;
};

export const teacherCheckClass = async (teacherId: string, classId: string) => {
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

export const getFoldersByClassId = async (classId: string) => {
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

// New student-related functions
export const getClassesByFaculty = async (facultyId: string) => {
  const response = await axiosInstance.get(`/class/faculty/${facultyId}/classes`);
  return response.data;
};

export const joinClass = async (classId: string, password: string) => {
  const response = await axiosInstance.post(`/class/${classId}/join`, { password });
  return response.data;
};

export const getFoldersForStudent = async (classId: string) => {
  const response = await axiosInstance.get(`/class/${classId}/FolderStudent`);
  return response.data;
};

export const submitAssignment = async (classId, folderId, formData) => {
  try {
    const response = await axiosInstance.post(`/class/${classId}/folders/${folderId}/assignments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
};

export const getSubmittedAssignments = async (classId) => {
  const response = await axiosInstance.get(`/class/${classId}/assignments`);
  return response.data;
};

export const getAssignmentsByFolder = async (classId: string, folderId: string) => {
  try {
    const response = await axiosInstance.get(`/class/${classId}/folders/${folderId}/assignments`);
    return response.data;
  } catch (error) {
    console.error('Error getting assignments:', error);
    throw error;
  }
};

// New function for grading an assignment
export const gradeAssignment = async (classId: string, assignmentId: string, gradeData: GradeData) => {
  try {
    const response = await axiosInstance.put(`/class/${classId}/assignments/${assignmentId}/grade`, gradeData);
    return response.data;
  } catch (error) {
    console.error('Error grading assignment:', error);
    throw error;
  }
};
