import axiosInstance from "../axiosInstance";

interface AcademicYearData {
  name: string;
  start_year: number;
  end_year: number;
}

interface SemesterData {
    name: string;
    academic_year_id: number;
}

interface ClassData {
    id: number;
    name: string;
    faculty_name: string;
    teacher_name: string;
    semester_name: string;
    academic_year_name: string;
  }

export const createAcademicYear = async (data: AcademicYearData) => {
  try {
    const response = await axiosInstance.post("/academicyear/create-acaYear", data);
    return response.data;
  } catch (error) {
    console.error("Error creating academic year:", error);
    throw error;
  }
};


export const getAcademicYears = async () => {
  try {
    const response = await axiosInstance.get("/academicyear/get-acaYear");
    return response.data;
  } catch (error) {
    console.error("Error fetching academic years:", error);
    throw error;
  }
};



  

  export const createSemester = async (data: SemesterData) => {
    try {
      const response = await axiosInstance.post("/academicyear/semesters", data);
      return response.data;
    } catch (error) {
      console.error("Error creating semester:", error);
      throw error;
    }
  };
  

  export const getSemestersByYear = async (academicYearId: number) => {
    try {
      const response = await axiosInstance.get(`/academicyear/semesters/year/${academicYearId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching semesters by year:", error);
      throw error;
    }
  };


  export const getClassesBySemester = async (semesterId: number): Promise<ClassData[]> => {
    try {
      const response = await axiosInstance.get(`/academicyear/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching classes by semester:", error);
      throw error;
    }
  };