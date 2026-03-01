import type { AxiosResponse } from "axios";
import type { RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Xác thực (Auth)
export const HandleSignUp = ({
  createAt,
  fullname,
  phone,
  email,
  username,
  password,
  authPassword,
}: {
  createAt: string;
  fullname: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  authPassword: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.auth,
            fieldAction: "sign-up",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "sign-up",
    new Blob(
      [
        JSON.stringify({
          createAt,
          fullname,
          phone,
          email,
          username,
          password,
          authPassword,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.auth}/customer-sign-up`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLogin = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Trường form data bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.auth,
            fieldAction: "login",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng xử lý
  formData.append(
    "account",
    new Blob(
      [
        JSON.stringify({
          username,
          password,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(`/api/${keys.auth}/login`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLogout = (): Promise<
  AxiosResponse<RestResponseType, any>
> => {
  return instance.post(
    `/api/${keys.auth}/logout`,
    getNewFormSecurityValue({ fieldName: keys.auth, fieldAction: "logout" })
  );
};
export const HandleAccount = (): Promise<
  AxiosResponse<RestResponseType, any>
> => {
  return instance.post(
    `/api/${keys.auth}/account`,
    getNewFormSecurityValue({ fieldName: keys.auth, fieldAction: "account" })
  );
};
