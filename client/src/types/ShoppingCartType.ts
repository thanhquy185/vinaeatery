import type { FoodInfoResponseType } from "../types/FoodType";

export interface ShoppingCartRequestType {
  food: FoodInfoResponseType;
  quantity: number;
}
