import type { CommonStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";

export interface FloorEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface FloorSummaryResponseType {
  id: number;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface FloorDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface FloorInfoResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface FloorCrudResponseType {
  id: number;
  name: string;
  description: string;
}

export interface FloorCreateRequestType {
  restaurantId: number;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface FloorUpdateRequestType {
  id: number;
  name: string;
  description: string;
}

export interface FloorDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
