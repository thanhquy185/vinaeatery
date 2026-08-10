import type {
  CategoryTableSurchargeTypeEnum,
  CommonStatusEnum,
} from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";

export interface CategoryTableEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  name: string;
  surchargeType: CategoryTableSurchargeTypeEnum;
  surchargeValue: number;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryTableDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  surchargeType: CategoryTableSurchargeTypeEnum;
  surchargeValue: number;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryTableSummaryResponseType {
  id: number;
  name: string;
  surchargeType: CategoryTableSurchargeTypeEnum;
  surchargeValue: number;
  status: CommonStatusEnum;
}

export interface CategoryTableInfoResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  surchargeType: CategoryTableSurchargeTypeEnum;
  surchargeValue: number;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryTableCrudResponseType {
  id: number;
  name: string;
  surchargeType: CategoryTableSurchargeTypeEnum;
  surchargeValue: number;
  description: string;
}

export interface CategoryTableCreateRequestType {
  restaurantId: number;
  name: string;
  surchargeType: CategoryTableSurchargeTypeEnum;
  surchargeValue: number;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryTableUpdateRequestType {
  id: number;
  name: string;
  surchargeType: CategoryTableSurchargeTypeEnum;
  surchargeValue: number;
  description: string;
}

export interface CategoryTableDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
