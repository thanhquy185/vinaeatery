import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { CustomerType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Khách hàng (Customer)
export const FindAllCustomer = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<CustomerType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "fullname") params.fullname = findValue!;
    if (findType! === "phone") params.phone = findValue!;
    if (findType! === "email") params.email = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<CustomerType[]>(
    `/api/${keys.customers}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "read" }),
    {
      params,
    },
  );
};
export const FindOneCustomer = (
  id: string,
): Promise<AxiosResponse<CustomerType, any>> => {
  return instance.post(
    `/api/${keys.customers}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "read" }),
  );
};
// export const FindOneCustomerByUserId = (
//   id: number
// ): Promise<AxiosResponse<CustomerType, any>> => {
//   return instance.post(
//     `/api/${keys.customers}/detail-by-user-id/${id}`,
//     getNewFormSecurityValue({ fieldName: keys.customers, fieldAction: "read" })
//   );
// };
export const HandleCreateCustomer = ({
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
}: CustomerType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.customers,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "customer",
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

  return instance.post(`/api/${keys.customers}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateCustomer = ({
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
}: CustomerType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.customers,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "customer",
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

  return instance.put(`/api/${keys.customers}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockCustomer = ({
  id,
  status,
}: CustomerType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.customers,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "customer",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.patch(`/api/${keys.customers}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
