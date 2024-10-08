import { useEffect, useState } from "react";
import { masterApi } from "../services/masterApi";

interface Role {
  id: number;
  name: string;
}

export const useRole = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await masterApi.getRole();
      setRoles(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return { loading, roles };
};