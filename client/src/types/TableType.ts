import type { CommonStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type { FloorEntityType, FloorInfoResponseType } from "./FloorType";
import type {
  CategoryTableEntityType,
  CategoryTableInfoResponseType,
} from "./CategoryTableType";

export interface TableEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  floor: FloorEntityType;
  categoryTable: CategoryTableEntityType;
  name: string;
  seats: number;
  description: string;
  status: CommonStatusEnum;
}

export interface TableDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  floor: FloorInfoResponseType;
  categoryTable: CategoryTableInfoResponseType;
  name: string;
  seats: number;
  description: string;
  status: CommonStatusEnum;
}

export interface TableSummaryResponseType {
  id: number;
  floor: FloorInfoResponseType;
  categoryTable: CategoryTableInfoResponseType;
  name: string;
  seats: number;
  status: CommonStatusEnum;
}

export interface TableInfoResponseType {
  id: number;
  floor: FloorInfoResponseType;
  categoryTable: CategoryTableInfoResponseType;
  name: string;
  seats: number;
  description: string;
  status: CommonStatusEnum;
}

export interface TableCrudResponseType {
  id: number;
  floor: FloorInfoResponseType;
  categoryTable: CategoryTableInfoResponseType;
  name: string;
  seats: number;
  description: string;
}

export interface TableCreateRequestType {
  restaurantId: number;
  name: string;
  floorId: number;
  categoryTableId: number;
  seats: number;
  description: string;
  status: CommonStatusEnum;
}

export interface TableUpdateRequestType {
  id: number;
  name: string;
  floorId: number;
  categoryTableId: number;
  seats: number;
  description: string;
}

export interface TableDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
