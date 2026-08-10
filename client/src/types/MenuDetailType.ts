import type { UseFoodStatusEnum } from "../constants/enums";
import type { FoodEntityType, FoodInfoResponseType } from "./FoodType";

interface MenuDetailIdEntityType {
  menuId: number;
  foodId: number;
}

export interface MenuDetailEntityType {
  id: MenuDetailIdEntityType;
  food: FoodEntityType;
}

export interface MenuDDetailResponseType {
  food: FoodInfoResponseType;
}

export interface MenuDetailCustomerResponseType {
  food: FoodInfoResponseType;
  status: UseFoodStatusEnum;
}

export interface MenuDetailCreateRequestType {
  foodId: number;
}

export interface MenuDetailUpdateRequestType {
  foodId: number;
}
