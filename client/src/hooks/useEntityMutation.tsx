import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingOutlined } from "@ant-design/icons";
import type { ReactQueryMutationProps } from "../common/props";
import type { RestResponseType } from "../types/RestResponseType";
import { openNotification } from "../utils/showNotificationUtil";

const notificationKey = "notification";

interface UseEntityMutationProps<RequestType, ResponseType> {
  messages: {
    success: string;
    error?: string;
  };
  invalidateKeys?: unknown[][];
  api: (params: RequestType) => Promise<RestResponseType<ResponseType>>;
}

const useEntityMutation = <RequestType, ResponseType>({
  messages,
  invalidateKeys = [],
  api,
}: UseEntityMutationProps<RequestType, ResponseType>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ values }: ReactQueryMutationProps<RequestType>) => {
      const res = await api(values!);
      if (res.status === 200 || res.status === 201) return res;
      else throw new Error(String(res.message));
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
    onSuccess: (data: RestResponseType<ResponseType>) => {
      console.log(1);
      console.log(data);
      openNotification({
        key: notificationKey,
        type: "success",
        message: "Thành công",
        description: data.message || messages.success || "Thao tác thành công!",
      });

      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
    },
    onError: (error: string) => {
      openNotification({
        key: notificationKey,
        type: "error",
        message: "Thất bại",
        description: error.toString() || messages.error || "Thao tác thất bại!",
      });
    },
  });
};

export default useEntityMutation;
