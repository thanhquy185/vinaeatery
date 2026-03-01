import type { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingOutlined } from "@ant-design/icons";
import type { ReactQueryMutationProps } from "../common/props";
import type { RestResponseType } from "../common/types";
import { openNotification } from "../utils/show-notification";

// Notification Key
const notificationKey = "notification";

// Use Entity Mutation Props
interface UseEntityMutationProps<T> {
  messages: {
    success: string;
    error?: string;
  };
  invalidateKeys?: unknown[][];
  api: (params: any) => Promise<AxiosResponse<RestResponseType, any>>;
}

// Use Entity Mutation
export function useEntityMutation<T>({
  messages,
  invalidateKeys = [],
  api,
}: UseEntityMutationProps<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ values }: ReactQueryMutationProps<T>) => {
      const res = await api(values);
      if (res.status === 200) return res.data;
      else throw new Error(String(res.data));
    },
    onMutate: () => {
      openNotification({
        key: notificationKey,
        type: "info",
        icon: <LoadingOutlined />,
        message: "Đang xử lý...",
        description: "Vui lòng chờ giây lát",
        duration: null,
      });
    },
    onSuccess: () => {
      openNotification({
        key: notificationKey,
        type: "success",
        message: "Thành công",
        description: messages.success,
      });

      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
    },
    onError: (error: any) => {
      openNotification({
        key: notificationKey,
        type: "error",
        message: "Thất bại",
        description: error?.message || messages.error || "Thao tác thất bại",
      });
    },
  });
}
