import axiosInstance from "../axiosInstance";


export const getUser = async () => {
    const response = await axiosInstance.get("user/listUser");
    return  response.data;
}

export const getInforUser = async (id: string) => {
    const response = await axiosInstance.get(`user/information/${id}`);
    return  response.data;
}

export const deleteUser = async (id: string) => {
    const response = await axiosInstance.delete(`user/deleteUser/${id}`);
    return  response.data;
}

export const updateUser = async (id: string, data: any) => {
    const response = await axiosInstance.put(`user/updateUser/${id}`, data);
    return  response.data;
}