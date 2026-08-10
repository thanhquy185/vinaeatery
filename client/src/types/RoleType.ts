import type { CommonStatusEnum, RoleSalaryTypeEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";

export interface RoleEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  name: string;
  salaryType: RoleSalaryTypeEnum;
  salaryValue: number;
  status: CommonStatusEnum;
}

export interface RoleDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  salaryType: RoleSalaryTypeEnum;
  salaryValue: number;
  status: CommonStatusEnum;
}

export interface RoleSummaryResponseType {
  id: number;
  name: string;
  salaryType: RoleSalaryTypeEnum;
  salaryValue: number;
  status: CommonStatusEnum;
}

export interface RoleInfoResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  salaryType: RoleSalaryTypeEnum;
  salaryValue: number;
  status: CommonStatusEnum;
}

export interface RoleCrudResponseType {
  id: number;
  name: string;
  salaryType: RoleSalaryTypeEnum;
  salaryValue: number;
}

export interface RoleCreateRequestType {
  restaurantId: number;
  name: string;
  salaryType: RoleSalaryTypeEnum;
  salaryValue: number;
  status: CommonStatusEnum;
}

export interface RoleUpdateRequestType {
  id: number;
  name: string;
  salaryType: RoleSalaryTypeEnum;
  salaryValue: number;
}

export interface RoleDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
