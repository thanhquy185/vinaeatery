import axios from "axios";

const api = axios.create({
  baseURL: "https://provinces.open-api.vn/api/v2",
});

const AddressApiService = {
  async getAllProvince(): Promise<any> {
    const response = await api.get("/p/");
    return response.data;
  },

  async getAllWardByProvinceCode(provinceCode: number) {
    const response = await api.get(`/p/${provinceCode}?depth=2`);
    return response.data;
  },
};

export default AddressApiService;
