import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { SupplierType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Nhà cung cấp (Supplier)
export const FindAllSupplier = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<SupplierType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<SupplierType[]>(
    `/api/${keys.suppliers}/list`,
    getNewFormSecurityValue({ fieldName: keys.suppliers, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindOneSupplier = (
  id: string
): Promise<AxiosResponse<SupplierType, any>> => {
  return instance.post(
    `/api/${keys.suppliers}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.suppliers, fieldAction: "read" })
  );
};
export const HandleCreateSupplier = ({
  restaurantId,
  name,
  phone,
  email,
  address,
  status,
}: SupplierType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.suppliers,
      fieldAction: "create",
    }),
    supplier: {
      restaurantId,
      name,
      phone,
      email,
      address,
      status,
    },
  };

  return instance.post(`/api/${keys.suppliers}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateSupplier = ({
  id,
  name,
  phone,
  email,
  address,
}: SupplierType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.suppliers,
      fieldAction: "update",
    }),
    supplier: {
      name,
      phone,
      email,
      address,
    },
  };

  return instance.put(`/api/${keys.suppliers}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockSupplier = ({
  id,
  status,
}: SupplierType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.suppliers,
      fieldAction: "lock",
    }),
    supplier: {
      status,
    },
  };

  return instance.patch(`/api/${keys.suppliers}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
