import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type {
  CategoryRewardPunishType,
  RestResponseType,
} from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Loại nguyên liệu (Category Reward Punishes)
export const FindAllCategoryRewardPunish = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<
  AxiosResponse<CategoryRewardPunishType[], any>
> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryRewardPunishType[]>(
    `/api/${keys.categoryRewardPunishes}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryRewardPunishes,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneCategoryRewardPunish = (
  id: string,
): Promise<AxiosResponse<CategoryRewardPunishType, any>> => {
  return instance.post(
    `/api/${keys.categoryRewardPunishes}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryRewardPunishes,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateCategoryRewardPunish = ({
  restaurantId,
  name,
  handle,
  description,
  status,
}: CategoryRewardPunishType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryRewardPunishes,
      fieldAction: "create",
    }),
    categoryRewardPunish: {
      restaurantId,
      name,
      handle,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.categoryRewardPunishes}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateCategoryRewardPunish = ({
  id,
  name,
  handle,
  description,
}: CategoryRewardPunishType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryRewardPunishes,
      fieldAction: "update",
    }),
    categoryRewardPunish: {
      name,
      handle,
      description,
    },
  };

  return instance.put(
    `/api/${keys.categoryRewardPunishes}/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
export const HandleLockCategoryRewardPunish = ({
  id,
  status,
}: CategoryRewardPunishType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryRewardPunishes,
      fieldAction: "lock",
    }),
    categoryRewardPunish: {
      status,
    },
  };

  return instance.patch(
    `/api/${keys.categoryRewardPunishes}/lock/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
