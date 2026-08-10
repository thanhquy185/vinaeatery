import AddressApiService from "../services/api/v1/AddressApiService";
import { useEffect, useState } from "react";

const useWards = (provinceCode?: number) => {
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (!provinceCode) {
      setWards([]);
      return;
    }

    const loadData = async () => {
      const response =
        await AddressApiService.getAllWardByProvinceCode(provinceCode);

      setWards(response.wards);
    };

    loadData();
  }, [provinceCode]);

  return wards;
};

export default useWards;
