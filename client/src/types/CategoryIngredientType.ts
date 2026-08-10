import type { CommonStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";

export interface CategoryIngredientEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryIngredientDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryIngredientSummaryResponseType {
  id: number;
  name: string;
  status: CommonStatusEnum;
}

export interface CategoryIngredientInfoResponseType {
  id: number;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryIngredientCrudResponseType {
  id: number;
  name: string;
  description: string;
}

export interface CategoryIngredientCreateRequestType {
  restaurantId: number;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryIngredientUpdateRequestType {
  id: number;
  name: string;
  description: string;
}

export interface CategoryIngredientDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
