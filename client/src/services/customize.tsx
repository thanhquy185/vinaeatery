import axios from "axios";
import { getAccessToken } from "../stores/accessTokenStore";
import { isPublicUrl } from "../utils/authUtil";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (isPublicUrl(config.url)) {
      return config;
    }

    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error: unknown) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if (response.data?.data) {
      return response.data;
    }

    return response;
  },

  (error) => {
    if (error.response?.data) {
      return error.response.data;
    }

    return error;
  },
);

export default instance;
