import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { CategoryInsuranceType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Loại bảo hiểm (Category Insurance)
export const FindAllCategoryInsurance = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<CategoryInsuranceType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryInsuranceType[]>(
    `/api/${keys.categoryInsurances}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryInsurances,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneCategoryInsurance = (
  id: string,
): Promise<AxiosResponse<CategoryInsuranceType, any>> => {
  return instance.post(
    `/api/${keys.categoryInsurances}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryInsurances,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateCategoryInsurance = ({
  restaurantId,
  name,
  companyPercent,
  employeePercent,
  description,
  status,
}: CategoryInsuranceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryInsurances,
      fieldAction: "create",
    }),
    categoryInsurance: {
      restaurantId,
      name,
      companyPercent,
      employeePercent,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.categoryInsurances}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateCategoryInsurance = ({
  id,
  name,
  companyPercent,
  employeePercent,
  description,
}: CategoryInsuranceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryInsurances,
      fieldAction: "update",
    }),
    categoryInsurance: {
      name,
      companyPercent,
      employeePercent,
      description,
    },
  };

  return instance.put(
    `/api/${keys.categoryInsurances}/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
export const HandleLockCategoryInsurance = ({
  id,
  status,
}: CategoryInsuranceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryInsurances,
      fieldAction: "lock",
    }),
    categoryInsurance: {
      status,
    },
  };

  return instance.patch(
    `/api/${keys.categoryInsurances}/lock/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
