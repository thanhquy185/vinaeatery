import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { CategoryTableType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Loại bàn ăn (Category Table)
export const FindAllCategoryTable = ({
  findType,
  findValue,
  surchargeTypeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<CategoryTableType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (surchargeTypeValue! && surchargeTypeValue!.length > 0)
    params.surchargeType = surchargeTypeValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryTableType[]>(
    `/api/${keys.categoryTables}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneCategoryTable = (
  id: string
): Promise<AxiosResponse<CategoryTableType, any>> => {
  return instance.post(
    `/api/${keys.categoryTables}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "read",
    })
  );
};
export const HandleCreateCategoryTable = ({
  restaurantId,
  name,
  surchargeType,
  surchargeValue,
  description,
  status,
}: CategoryTableType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "create",
    }),
    categoryTable: {
      restaurantId,
      name,
      surchargeType,
      surchargeValue,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.categoryTables}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateCategoryTable = ({
  id,
  name,
  surchargeType,
  surchargeValue,
  description,
}: CategoryTableType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "update",
    }),
    categoryTable: {
      name,
      surchargeType,
      surchargeValue,
      description,
    },
  };

  return instance.put(`/api/${keys.categoryTables}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockCategoryTable = ({
  id,
  status,
}: CategoryTableType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryTables,
      fieldAction: "lock",
    }),
    categoryTable: {
      status,
    },
  };

  return instance.patch(`/api/${keys.categoryTables}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
