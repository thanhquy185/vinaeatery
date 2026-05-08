import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { CategoryAllowanceType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Loại phụ cấp (Category Allowance)
export const FindAllCategoryAllowance = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<CategoryAllowanceType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryAllowanceType[]>(
    `/api/${keys.categoryAllowances}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryAllowances,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneCategoryAllowance = (
  id: string,
): Promise<AxiosResponse<CategoryAllowanceType, any>> => {
  return instance.post(
    `/api/${keys.categoryAllowances}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryAllowances,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateCategoryAllowance = ({
  restaurantId,
  name,
  money,
  description,
  status,
}: CategoryAllowanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryAllowances,
      fieldAction: "create",
    }),
    categoryAllowance: {
      restaurantId,
      name,
      money,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.categoryAllowances}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateCategoryAllowance = ({
  id,
  name,
  money,
  description,
}: CategoryAllowanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryAllowances,
      fieldAction: "update",
    }),
    categoryAllowance: {
      name,
      money,
      description,
    },
  };

  return instance.put(
    `/api/${keys.categoryAllowances}/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
export const HandleLockCategoryAllowance = ({
  id,
  status,
}: CategoryAllowanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryAllowances,
      fieldAction: "lock",
    }),
    categoryAllowance: {
      status,
    },
  };

  return instance.patch(
    `/api/${keys.categoryAllowances}/lock/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
