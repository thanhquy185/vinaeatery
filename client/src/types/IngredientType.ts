import type { CommonStatusEnum, IngredientUnitEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  CategoryIngredientEntityType,
  CategoryIngredientInfoResponseType,
} from "./CategoryIngredientType";

export interface IngredientEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  categoryIngredient: CategoryIngredientEntityType;
  name: string;
  unit: IngredientUnitEnum;
  capacity: number;
  dateCreate: string;
  dateRemove: string;
  inputPrice: number;
  inventory: number;
  note: string;
  status: CommonStatusEnum;
}

export interface IngredientDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  categoryIngredient: CategoryIngredientInfoResponseType;
  name: string;
  unit: IngredientUnitEnum;
  capacity: number;
  dateCreate: string;
  dateRemove: string;
  inputPrice: number;
  inventory: number;
  note: string;
  status: CommonStatusEnum;
}

export interface IngredientSummaryResponseType {
  id: number;
  categoryIngredient: CategoryIngredientInfoResponseType;
  name: string;
  unit: IngredientUnitEnum;
  capacity: number;
  inputPrice: number;
  inventory: number;
  status: CommonStatusEnum;
}

export interface IngredientInfoResponseType {
  id: number;
  categoryIngredient: CategoryIngredientInfoResponseType;
  name: string;
  unit: IngredientUnitEnum;
  capacity: number;
  dateCreate: string;
  dateRemove: string;
  inputPrice: number;
  inventory: number;
  note: string;
  status: CommonStatusEnum;
}

export interface IngredientCrudResponseType {
  id: number;
  categoryIngredient: CategoryIngredientInfoResponseType;
  name: string;
  unit: IngredientUnitEnum;
  capacity: number;
  dateCreate: string;
  dateRemove: string;
  inputPrice: number;
  inventory: number;
  note: string;
}

export interface IngredientCreateRequestType {
  restaurantId: number;
  name: string;
  categoryIngredientId: number;
  unit: IngredientUnitEnum;
  capacity: number;
  dateCreate?: string;
  dateRemove?: string;
  inputPrice: number;
  inventory: number;
  note: string;
  status: CommonStatusEnum;
}

export interface IngredientUpdateRequestType {
  id: number;
  name: string;
  categoryIngredientId: number;
  unit: IngredientUnitEnum;
  capacity: number;
  dateCreate?: string;
  dateRemove?: string;
  inputPrice: number;
  inventory: number;
  note: string;
}

export interface IngredientDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
