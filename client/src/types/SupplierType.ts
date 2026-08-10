import type { CommonStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";

export interface SupplierEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  fullname: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  status: CommonStatusEnum;
}

export interface SupplierDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  fullname: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  status: CommonStatusEnum;
}

export interface SupplierSummaryResponseType {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  status: CommonStatusEnum;
}

export interface SupplierInfoResponseType {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  status: CommonStatusEnum;
}

export interface SupplierCrudResponseType {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
}

export interface SupplierCreateRequestType {
  restaurantId: number;
  fullname: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  status: CommonStatusEnum;
}

export interface SupplierUpdateRequestType {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
}

export interface SupplierDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
