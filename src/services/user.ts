import axiosInstance from "../axiosInstance";

interface PasswordUpdateData {
    newPassword: string;
}


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

export const updateStatusUser = async (id: string, data: any) => {
    const response = await axiosInstance.put(`user/${id}/status`, data);
    return response.data;
}
export const updateUserPassword = async (id: string, password: string) => {
    const response = await axiosInstance.put(`user/${id}/password`, {
        newPassword: password
    });
    return response.data;
}

export const getMe = async () => { 
    const response = await axiosInstance.get("user/me");
    return response.data;
} 