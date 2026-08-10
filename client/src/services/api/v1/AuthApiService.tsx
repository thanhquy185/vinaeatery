import instance from "../../customize";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  AuthCustomerRegisterRequestType,
  AuthLoginRequestType,
  AuthLoginResponseType,
} from "../../../types/AuthType";
import type { CustomerDetailResponseType } from "../../../types/CustomerType";
import type { UserDetailResponseType } from "../../../types/UserType";
import type { ManagerDetailResponseType } from "../../../types/ManagerType";
import type { EmployeeDetailResponseType } from "../../../types/EmployeeType";

const FEATURE_NAME = "auth";

const AuthApiService = {
  async handleCustomerRegister({
    username,
    password,
    password2,
    customerFullname,
    customerPhone,
    customerEmail,
  }: AuthCustomerRegisterRequestType): Promise<
    RestResponseType<CustomerDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}/customer/register`,
      {
        username,
        password,
        password2,
        customerFullname,
        customerPhone,
        customerEmail,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleLogin({
    username,
    password,
  }: AuthLoginRequestType): Promise<RestResponseType<AuthLoginResponseType>> {
    return instance.post(
      `/api/v1/${FEATURE_NAME}/login`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleGetInfo(): Promise<
    RestResponseType<
      | UserDetailResponseType
      | ManagerDetailResponseType
      | EmployeeDetailResponseType
    >
  > {
    return instance.post(`/api/v1/${FEATURE_NAME}/get-info`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  async handleRefreshToken(): Promise<RestResponseType<AuthLoginResponseType>> {
    return instance.post(`/api/v1/${FEATURE_NAME}/refresh-token`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  async handleLogout(): Promise<RestResponseType<AuthLoginResponseType>> {
    return instance.post(`/api/v1/${FEATURE_NAME}/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default AuthApiService;
