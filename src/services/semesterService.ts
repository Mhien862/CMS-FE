import axiosInstance from "../axiosInstance";

interface SemesterData {
  name: string;
  academic_year_id: number;
}


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
