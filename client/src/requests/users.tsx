import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { UserType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Tài khoản (User)
export const FindAllUser = ({
  findType,
  findValue,
  roleValue,
  isUsingValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<UserType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "username") params.username = findValue!;
  }
  if (roleValue! && roleValue!.length > 0) params.role = roleValue![0];
  if (isUsingValue! && isUsingValue!.length > 0)
    params.isUsing = isUsingValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<UserType[]>(
    `/api/${keys.users}/list`,
    getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "read",
    }),
    { params },
  );
};
export const FindOneUser = (
  id: string,
): Promise<AxiosResponse<UserType, any>> => {
  return instance.post(
    `/api/${keys.users}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.users, fieldAction: "read" }),
  );
};
export const HandleCreateUser = ({
  createAt,
  role,
  username,
  password,
  method,
  isUsing,
  status,
}: UserType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "create",
    }),
    user: {
      createAt,
      role,
      username,
      password,
      method,
      isUsing,
      status,
    },
  };

  return instance.post(`/api/${keys.users}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateUser = ({
  id,
  role,
  // method,
}: UserType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "update",
    }),
    user: {
      role,
      // method,
    },
  };

  return instance.put(`/api/${keys.users}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockUser = ({
  id,
  status,
}: UserType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "lock",
    }),
    user: {
      status,
    },
  };

  return instance.patch(`/api/${keys.users}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleChangePasswordUser = ({
  id,
  newPassword,
  authNewPassword,
}: {
  id?: number;
  newPassword?: string;
  authNewPassword?: string;
  updateAt?: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.users,
      fieldAction: "change-password",
    }),
    user: {
      newPassword,
      authNewPassword,
    },
  };

  return instance.put(`/api/${keys.users}/change-password/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
