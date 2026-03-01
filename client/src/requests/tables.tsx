import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { TableType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Bàn ăn (Table)
export const FindAllTable = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<TableType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryTableId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<TableType[]>(
    `/api/${keys.tables}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.tables, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindOneTable = (
  id: string
): Promise<AxiosResponse<TableType, any>> => {
  return instance.post(
    `/api/${keys.tables}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.tables, fieldAction: "read" })
  );
};
export const HandleCreateTable = ({
  restaurantId,
  name,
  categoryTableId,
  floorId,
  seats,
  description,
  status,
}: TableType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.tables,
      fieldAction: "create",
    }),
    table: {
      restaurantId,
      name,
      categoryTableId,
      floorId,
      seats,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.tables}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateTable = ({
  id,
  name,
  categoryTableId,
  floorId,
  seats,
  description,
}: TableType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.tables,
      fieldAction: "update",
    }),
    table: {
      name,
      categoryTableId,
      floorId,
      seats,
      description,
    },
  };

  return instance.put(`/api/${keys.tables}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockTable = ({
  id,
  status,
}: TableType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.tables,
      fieldAction: "lock",
    }),
    table: {
      status,
    },
  };

  return instance.patch(`/api/${keys.tables}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
