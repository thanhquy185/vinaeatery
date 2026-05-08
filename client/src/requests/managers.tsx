import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { ManagerType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Chủ nhà hàng (Manager)
export const FindAllManager = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<ManagerType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "fullname") params.fullname = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<ManagerType[]>(
    `/api/${keys.managers}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.managers, fieldAction: "read" }),
    {
      params,
    },
  );
};
export const FindOneManager = (
  id: string,
): Promise<AxiosResponse<ManagerType, any>> => {
  return instance.post(
    `/api/${keys.managers}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.managers, fieldAction: "read" }),
  );
};
// export const FindOneManagerByUserId = (
//   id: number
// ): Promise<AxiosResponse<ManagerType, any>> => {
//   return instance.post(
//     `/api/${keys.managers}/detail-by-user-id/${id}`,
//     getNewFormSecurityValue({ fieldName: keys.managers, fieldAction: "read" })
//   );
// };
export const HandleCreateManager = ({
  userId,
  createAt,
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  description,
  status,
}: ManagerType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.managers,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "manager",
    new Blob(
      [
        JSON.stringify({
          userId,
          createAt,
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          description,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.managers}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateManager = ({
  id,
  userId,
  image,
  fullname,
  birthday,
  gender,
  phone,
  email,
  address,
  description,
}: ManagerType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.managers,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "manager",
    new Blob(
      [
        JSON.stringify({
          userId,
          fullname,
          birthday,
          gender,
          phone,
          email,
          address,
          description,
        }),
      ],
      { type: "application/json" },
    ),
  );
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.managers}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockManager = ({
  id,
  status,
}: ManagerType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.managers,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "manager",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.patch(`/api/${keys.managers}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
