import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { SalaryAdvanceType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Ứng lương (Salary Advance)
export const FindAllSalaryAdvance = ({
  findType,
  findValue,
  timeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<SalaryAdvanceType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.createAtStart = timeValue![0];
    if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<SalaryAdvanceType[]>(
    `/api/${keys.salaryAdvances}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.salaryAdvances,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneSalaryAdvance = (
  id: string,
): Promise<AxiosResponse<SalaryAdvanceType, any>> => {
  return instance.post(
    `/api/${keys.salaryAdvances}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.salaryAdvances,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateSalaryAdvance = ({
  restaurantId,
  createAt,
  employeeHandleId,
  employeeMainId,
  date,
  money,
  reason,
  status,
}: SalaryAdvanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.salaryAdvances,
      fieldAction: "create",
    }),
    salaryAdvance: {
      restaurantId,
      createAt,
      employeeHandleId,
      employeeMainId,
      date,
      money,
      reason,
      status,
    },
  };

  return instance.post(`/api/${keys.salaryAdvances}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateSalaryAdvance = ({
  id,
  status,
}: SalaryAdvanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.salaryAdvances,
      fieldAction: "update",
    }),
    salaryAdvance: {
      status,
    },
  };

  return instance.put(`/api/${keys.salaryAdvances}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
