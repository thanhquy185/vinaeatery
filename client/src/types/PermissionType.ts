import type { CommonStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  PermissionDDetailResponseType,
  PermissionDetailCreateRequestType,
  PermissionDetailEntityType,
  PermissionDetailUpdateRequestType,
} from "./PermissionDetailType";

export interface PermissionEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  name: string;
  status: CommonStatusEnum;
  permissionDetails: PermissionDetailEntityType[];
}

export interface PermissionDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  status: CommonStatusEnum;
  permissionDetails: PermissionDDetailResponseType[];
}

export interface PermissionSummaryResponseType {
  id: number;
  name: string;
  status: CommonStatusEnum;
}

export interface PermissionInfoResponseType {
  id: number;
  name: string;
  status: CommonStatusEnum;
  permissionDetails: PermissionDDetailResponseType[];
}

export interface PermissionCrudResponseType {
  id: number;
  name: string;
}

export interface PermissionCreateRequestType {
  restaurantId: number;
  name: string;
  status: CommonStatusEnum;
  permissionDetails: PermissionDetailCreateRequestType[];
}

export interface PermissionUpdateRequestType {
  id: number;
  name: string;
  permissionDetails: PermissionDetailUpdateRequestType[];
}

export interface PermissionDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
