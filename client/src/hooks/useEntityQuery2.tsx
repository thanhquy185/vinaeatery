import { useQuery } from "@tanstack/react-query";
import { ReactQueryGetData } from "../constants/values";
import { openNotification } from "../utils/showNotificationUtil";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../constants/props";

interface useEntityQueryProps<T> {
  keys: any[];
  enabled?: boolean;
  params: FilterDataProps;
  retry?: number;
  staleTime?: number;
  api: (params: FilterDataProps) => Promise<AxiosResponse<T, any>>;
}

const useEntityQuery = <T,>({
  keys,
  enabled = true,
  params,
  retry,
  staleTime,
  api,
}: useEntityQueryProps<T>) => {
  return useQuery<T>({
    queryKey: keys,
    queryFn: async () => {
      const response = await api(params);

      if (response.status === 200) return response.data as unknown as T;
      else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description:
            String(response.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw new Error(String(response.data));
      }
    },
    enabled: enabled,
    retry: retry || ReactQueryGetData.retry,
    staleTime: staleTime || ReactQueryGetData.staleTime,
  });
};

export default useEntityQuery;
