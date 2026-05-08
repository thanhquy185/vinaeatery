import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { PermissionType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Quyền hạn (Permission)
export const FindAllPermission = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<PermissionType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<PermissionType[]>(
    `/api/${keys.permissions}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.permissions,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOnePermission = (
  id: string,
): Promise<AxiosResponse<PermissionType, any>> => {
  return instance.post(
    `/api/${keys.permissions}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.permissions,
      fieldAction: "read",
    }),
  );
};
export const HandleCreatePermission = ({
  restaurantId,
  name,
  status,
  permissionDetails,
}: PermissionType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.permissions,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "permission",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          name,
          status,
          permissionDetails,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.post(`/api/${keys.permissions}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdatePermission = ({
  id,
  name,

  permissionDetails,
}: PermissionType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.permissions,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "permission",
    new Blob(
      [
        JSON.stringify({
          name,

          permissionDetails,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.permissions}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockPermission = ({
  id,
  status,
}: PermissionType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.permissions,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "permission",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.permissions}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
