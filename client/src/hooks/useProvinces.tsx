import AddressApiService from "../services/api/v1/AddressApiService";
import { useEffect, useState } from "react";

const useProvinces = () => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await AddressApiService.getAllProvince();
      setProvinces(response);
    };

    loadData();
  }, []);

  return provinces;
};

export default useProvinces;
