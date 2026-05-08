import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { EmployeeType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Nhân viên (Employee)
export const FindAllEmployee = ({
  findType,
  findValue,
  roleValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<EmployeeType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "fullname") params.fullname = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (roleValue! && roleValue!.length > 0) params.roleId = roleValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<EmployeeType[]>(
    `/api/${keys.employees}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "read" }),
    {
      params,
    },
  );
};
export const FindOneEmployee = (
  id: string,
): Promise<AxiosResponse<EmployeeType, any>> => {
  return instance.post(
    `/api/${keys.employees}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "read" }),
  );
};
// export const FindOneEmployeeByUserId = (
//   id: number
// ): Promise<AxiosResponse<EmployeeType, any>> => {
//   return instance.post(
//     `/api/${keys.employees}/detail-by-user-id/${id}`,
//     getNewFormSecurityValue({ fieldName: keys.employees, fieldAction: "read" })
//   );
// };
export const HandleCreateEmployee = ({
  restaurantId,
  createAt,
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  roleId,
  username,
  password,
  permissionId,
  status,
}: EmployeeType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.employees,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "employee",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          createAt,
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          roleId,
          username,
          password,
          permissionId,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.employees}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateEmployee = ({
  id,
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  roleId,
  permissionId,
}: EmployeeType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.employees,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "employee",
    new Blob(
      [
        JSON.stringify({
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          roleId,
          permissionId,
        }),
      ],
      { type: "application/json" },
    ),
  );
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.employees}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockEmployee = ({
  id,
  status,
}: EmployeeType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.employees,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "employee",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.employees}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
