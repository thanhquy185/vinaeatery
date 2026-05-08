import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { AllowanceType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Phụ cấp (Allowance)
export const FindAllAllowance = ({
  findType,
  findValue,
  timeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<AllowanceType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.createAtStart = timeValue![0];
    if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<AllowanceType[]>(
    `/api/${keys.allowances}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.allowances,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneAllowance = (
  id: string,
): Promise<AxiosResponse<AllowanceType, any>> => {
  return instance.post(
    `/api/${keys.allowances}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.allowances,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateAllowance = ({
  restaurantId,
  name,
  month,
  note,
  status,
  allowanceDetails,
}: AllowanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.allowances,
      fieldAction: "create",
    }),
    allowance: {
      restaurantId,
      name,
      month,
      note,
      status,
      allowanceDetails,
    },
  };

  return instance.post(`/api/${keys.allowances}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateAllowance = ({
  id,
  name,
  month,
  note,
  allowanceDetails,
}: AllowanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.allowances,
      fieldAction: "update",
    }),
    allowance: {
      name,
      month,
      note,
      allowanceDetails,
    },
  };

  return instance.put(`/api/${keys.allowances}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockAllowance = ({
  id,
  status,
}: AllowanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.allowances,
      fieldAction: "lock",
    }),
    allowance: {
      status,
    },
  };

  return instance.patch(`/api/${keys.allowances}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
