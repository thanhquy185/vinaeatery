import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { InsuranceType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Bảo hiểm (Insurance)
export const FindAllInsurance = ({
  findType,
  findValue,
  timeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<InsuranceType[], any>> => {
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

  return instance.post<InsuranceType[]>(
    `/api/${keys.insurances}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.insurances,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneInsurance = (
  id: string,
): Promise<AxiosResponse<InsuranceType, any>> => {
  return instance.post(
    `/api/${keys.insurances}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.insurances,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateInsurance = ({
  restaurantId,
  name,
  month,
  note,
  status,
  insuranceDetails,
}: InsuranceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.insurances,
      fieldAction: "create",
    }),
    insurance: {
      restaurantId,
      name,
      month,
      note,
      status,
      insuranceDetails,
    },
  };

  return instance.post(`/api/${keys.insurances}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateInsurance = ({
  id,
  name,
  month,
  note,
  insuranceDetails,
}: InsuranceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.insurances,
      fieldAction: "update",
    }),
    insurance: {
      name,
      month,
      note,
      insuranceDetails,
    },
  };

  return instance.put(`/api/${keys.insurances}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockInsurance = ({
  id,
  status,
}: InsuranceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.insurances,
      fieldAction: "lock",
    }),
    insurance: {
      status,
    },
  };

  return instance.patch(`/api/${keys.insurances}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
