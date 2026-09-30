import type { RcFile } from "antd/es/upload";
import type { EmployeeStatusEnum } from "../constants/enums";
import type { UserEntityType, UserInfoResponseType } from "./UserType";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type { RoleEntityType, RoleInfoResponseType } from "./RoleType";
import type {
  RoleHistoryDetailResponseType,
  RoleHistoryEntityType,
} from "./RoleHistoryType";
import type {
  PermissionEntityType,
  PermissionInfoResponseType,
} from "./PermissionType";

export interface EmployeeEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  user: UserEntityType;
  role: RoleEntityType;
  permission: PermissionEntityType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: EmployeeStatusEnum;
  roleHistories: RoleHistoryEntityType[];
}

export interface EmployeeDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  user: UserInfoResponseType;
  role: RoleInfoResponseType;
  permission: PermissionInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: EmployeeStatusEnum;
  roleHistories: RoleHistoryDetailResponseType[];
}

export interface EmployeeSummaryResponseType {
  id: number;
  user: UserInfoResponseType;
  role: RoleInfoResponseType;
  permission: PermissionInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  status: EmployeeStatusEnum;
}

export interface EmployeeCrudResponseType {
  id: number;
  user: UserInfoResponseType;
  role: RoleInfoResponseType;
  permission: PermissionInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
}

export interface EmployeeInfoResponseType {
  id: number;
  user: UserInfoResponseType;
  role: RoleInfoResponseType;
  permission: PermissionInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
}

export interface EmployeeSubInfoResponseType {
  id: number;
  imageUrl: string;
  imagePublicId: string;
  fullname: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
}

export interface EmployeeCreateRequestType {
  restaurantId: number;
  roleId: number;
  permissionId: number;
  image: File | RcFile | undefined;
  fullname: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: EmployeeStatusEnum;
  userUsername: string;
  userPassword: string;
}

export interface EmployeeUpdateRequestType {
  id: number;
  roleId: number;
  permissionId: number;
  image: File | RcFile | undefined;
  fullname: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
}

export interface EmployeeDeleteRequestType {
  id: number;
  status: EmployeeStatusEnum;
}
