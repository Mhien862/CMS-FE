import { useEffect, useState } from "react";
import { masterApi } from "../services/masterApi";

interface Faculty {
  id: number;
  name: string;
}

export const useFaculty = () => {
  const [loading, setLoading] = useState(false);
  const [faculty,setFaculty] = useState<Faculty[]>([]);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await masterApi.getFaculty();
      setFaculty(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return { loading, faculty };
};