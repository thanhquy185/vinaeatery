import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { RoleType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Chức vụ (Role)
export const FindAllRole = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<RoleType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<RoleType[]>(
    `/api/${keys.roles}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.roles, fieldAction: "read" }),
    {
      params,
    },
  );
};
export const FindOneRole = (
  id: string,
): Promise<AxiosResponse<RoleType, any>> => {
  return instance.post(
    `/api/${keys.roles}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.roles, fieldAction: "read" }),
  );
};
export const HandleCreateRole = ({
  restaurantId,
  name,
  salaryType,
  salaryValue,
  status,
}: RoleType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.roles,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "role",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          name,
          salaryType,
          salaryValue,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.post(`/api/${keys.roles}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateRole = ({
  id,
  name,
  salaryType,
  salaryValue,
  updateAt,
}: RoleType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.roles,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "role",
    new Blob(
      [
        JSON.stringify({
          name,
          salaryType,
          salaryValue,
          updateAt,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.roles}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockRole = ({
  id,
  status,
  updateAt,
}: RoleType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.roles,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "role",
    new Blob(
      [
        JSON.stringify({
          status,
          updateAt,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.roles}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
