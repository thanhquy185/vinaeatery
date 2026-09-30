import type { RcFile } from "antd/es/upload";
import type { CommonGenderEnum, CommonStatusEnum } from "../constants/enums";
import type { UserEntityType, UserInfoResponseType } from "./UserType";

export interface ManagerEntityType {
  id: number;
  user: UserEntityType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: CommonGenderEnum;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
}

export interface ManagerDetailResponseType {
  id: number;
  user: UserInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: CommonGenderEnum;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
}

export interface ManagerSummaryResponseType {
  id: number;
  user: UserInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: CommonGenderEnum;
  phone: string;
  email: string;
  status: CommonStatusEnum;
}

export interface ManagerInfoResponseType {
  id: number;
  user: UserInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: CommonGenderEnum;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
}

export interface ManagerCrudResponseType {
  id: number;
  user: UserInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: CommonGenderEnum;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
}

export interface ManagerCreateRequestType {
  image: File | RcFile | undefined;
  fullname: string;
  birthdate: string;
  gender: CommonGenderEnum;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
  userUsername: string;
  userPassword: string;
}

export interface ManagerUpdateRequestType {
  id: number;
  image: File | RcFile | undefined;
  fullname: string;
  birthdate: string;
  gender: CommonGenderEnum;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
}

export interface ManagerDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
