import type { CommonStatusEnum, MenuTypeEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type { UseTableEntityType } from "./UseTableType";
import type {
  MenuDDetailResponseType,
  MenuDetailCreateRequestType,
  MenuDetailCustomerResponseType,
  MenuDetailEntityType,
  MenuDetailUpdateRequestType,
} from "./MenuDetailType";

export interface MenuEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  useTable: UseTableEntityType;
  name: string;
  type: MenuTypeEnum;
  price: number;
  description: string;
  status: CommonStatusEnum;
  menuDetails: MenuDetailEntityType[];
}

export interface MenuDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  type: MenuTypeEnum;
  price: number;
  description: string;
  status: CommonStatusEnum;
  menuDetails: MenuDDetailResponseType[];
}

export interface MenuSummaryResponseType {
  id: number;
  name: string;
  type: MenuTypeEnum;
  price: number;
  status: CommonStatusEnum;
}

export interface MenuInfoResponseType {
  id: number;
  name: string;
  type: MenuTypeEnum;
  price: number;
  description: string;
}

export interface MenuCustomerResponseType {
  id: number;
  name: string;
  type: MenuTypeEnum;
  price: number;
  description: string;
  menuDetails: MenuDetailCustomerResponseType[];
}

export interface MenuCreateRequestType {
  restaurantId: number;
  name: string;
  type: MenuTypeEnum;
  price: number;
  description: string;
  status: CommonStatusEnum;
  menuDetails: MenuDetailCreateRequestType[];
}

export interface MenuUpdateRequestType {
  id: number;
  name: string;
  type: MenuTypeEnum;
  price: number;
  description: string;
  menuDetails: MenuDetailUpdateRequestType[];
}

export interface MenuDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
