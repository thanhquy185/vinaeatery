import { useQuery } from "@tanstack/react-query";
import { ReactQueryGetData } from "../constants/values";
import { openNotification } from "../utils/showNotificationUtil";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";

interface UseEntityQueryToListProps<T> {
  keys: any[];
  enabled?: boolean;
  params: FilterDataProps;
  api: (params: FilterDataProps) => Promise<AxiosResponse<T, any>>;
}

const useEntityQueryToList = <T,>({
  keys,
  enabled = true,
  params,
  api,
}: UseEntityQueryToListProps<T>) => {
  return useQuery<T>({
    queryKey: keys,
    queryFn: async () => {
      const res = await api(params);

      if (res.status === 200) return res.data;
      else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw new Error(String(res.data));
      }
    },
    enabled: enabled,
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
};

export default useEntityQueryToList;
