import type { UserDetailResponseType } from "./UserType";

export interface AuthCustomerRegisterRequestType {
  username: string;
  password: string;
  password2: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
}

export interface AuthGetInfoResponseType {}

export interface AuthLoginRequestType {
  username: string;
  password: string;
}

export interface AuthLoginResponseType {
  accessToken: string;
  refreshToken: string;
  userInfo: UserDetailResponseType;
}
