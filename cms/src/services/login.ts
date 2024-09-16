import axiosInstance from "../axiosInstance";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  localStorage.setItem("token", JSON.stringify(response.data.token));
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  username: string,
  role: string,
  faculty: string
) => {
  const response = await axiosInstance.post("auth/register", {
    email,
    password,
    username,
    role,
    faculty,
  });
  return response.data;
};
