import axiosInstance from "../axiosInstance";

interface UserData {
  username: string;
  email: string;
  password: string;
  role_id: string;
  faculty_id: string;
}

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token); 
  }
  return response.data;
};
export const register = async (userData: UserData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};
