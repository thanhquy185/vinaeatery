import type { RcFile } from "antd/es/upload";
import type { CommonGenderEnum, CommonStatusEnum } from "../constants/enums";
import type { UserEntityType, UserInfoResponseType } from "./UserType";

export interface CustomerEntityType {
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

export interface CustomerDetailResponseType {
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

export interface CustomerSummaryResponseType {
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

export interface CustomerInfoResponseType {
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

export interface CustomerCrudResponseType {
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

export interface CustomerCreateRequestType {
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

export interface CustomerUpdateRequestType {
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

export interface CustomerDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
