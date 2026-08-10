import type { UserMethodEnum, UserRoleEnum } from "../constants/enums";

export interface UserEntityType {
  id: number;
  role: UserRoleEnum;
  username: string;
  password: string;
  method: UserMethodEnum;
  refreshToken: string;
  status: string;
}

export interface UserDetailResponseType {
  id: number;
  role: UserRoleEnum;
  username: string;
  password: string;
  method: UserMethodEnum;
  status: string;
}

export interface UserSummaryResponseType {
  id: number;
  role: UserRoleEnum;
  username: string;
  password: string;
  method: UserMethodEnum;
  status: string;
}

export interface UserInfoResponseType {
  id: number;
  role: UserRoleEnum;
  username: string;
  password: string;
  method: UserMethodEnum;
  status: string;
}

export interface UserCreateRequestType {
  role: UserRoleEnum;
  username: string;
  password: string;
  method: UserMethodEnum;
  status: string;
}

export interface UserChangePasswordRequestType {
  id: number;
  newPassword: string;
  newPassword2: string;
}

export interface UserDeleteRequestType {
  id: number;
  status: string;
}
