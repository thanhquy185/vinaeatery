import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { FloorType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Tầng (Floor)
export const FindAllFloor = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<FloorType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<FloorType[]>(
    `/api/${keys.floors}/list`,
    getNewFormSecurityValue({ fieldName: keys.floors, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindOneFloor = (
  id: string
): Promise<AxiosResponse<FloorType, any>> => {
  return instance.post(
    `/api/floors/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.floors, fieldAction: "read" })
  );
};
export const HandleCreateFloor = ({
  restaurantId,
  name,
  description,
  status,
}: FloorType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.floors,
      fieldAction: "create",
    }),
    floor: {
      restaurantId,
      name,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.floors}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateFloor = ({
  id,
  name,
  description,
}: FloorType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.floors,
      fieldAction: "update",
    }),
    floor: {
      name,
      description,
    },
  };

  return instance.put(`/api/${keys.floors}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockFloor = ({
  id,
  status,
}: FloorType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.floors,
      fieldAction: "lock",
    }),
    floor: {
      status,
    },
  };

  return instance.patch(`/api/${keys.floors}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
