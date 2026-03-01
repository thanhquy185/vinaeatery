import type { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import type { FilterDataProps } from "../common/props";
import { ReactQueryGetData } from "../common/values";
import { openNotification } from "../utils/show-notification";

// Use Entity Query Props
interface UseEntityQueryProps<T> {
  keys: any[];
  enabled?: boolean;
  params: FilterDataProps;
  api: (params: FilterDataProps) => Promise<AxiosResponse<T, any>>;
}

// Use Entity Query
export function useEntityQuery<T>({
  keys,
  enabled = true,
  params,
  api,
}: UseEntityQueryProps<T>) {
  return useQuery<T>({
    queryKey: keys,
    queryFn: async () => {
      const res = await api(params);

      if (res.status === 200) return res.data;
      else {
        // openNotification({
        //   type: "error",
        //   message: "Truy vấn dữ liệu thất bại",
        //   description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
        //   duration: 2,
        // });

        throw new Error(String(res.data));
      }
    },
    enabled: enabled,
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
}
