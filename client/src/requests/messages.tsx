import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { MessageType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api liên quan đến Tin nhắn (Message)
export const FindMessage = (): Promise<AxiosResponse<MessageType[], any>> => {
  return instance.post(
    `/api/${keys.messages}/list`,
    getNewFormSecurityValue({
      fieldName: keys.messages,
      fieldAction: "read",
    })
  );
};
export const FindMessageFormat = ({
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<MessageType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post(
    `/api/${keys.messages}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.messages,
      fieldAction: "read",
    }),
    { params }
  );
};
export const FindMessageFormatUseTableIsNull = ({
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<MessageType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post(
    `/api/${keys.messages}/list-format?useTableTimeEnd=null`,
    getNewFormSecurityValue({
      fieldName: keys.messages,
      fieldAction: "read",
    }),
    { params }
  );
};
