import type { FoodEntityType, FoodInfoResponse2Type } from "./FoodType";

interface OrderSheetDetailIdEntityType {
  orderSheetId: number;
  foodId: number;
}

export interface OrderSheetDetailEntityType {
  id: OrderSheetDetailIdEntityType;
  food: FoodEntityType;
  quantity: number;
  price: number;
  foodNameSnapshot: string;
  foodUnitSnapshot: string;
  foodPriceSnapshot: number;
  totalPriceDetail: number;
}

export interface OrderSheetDDetailResponseType {
  food: FoodInfoResponse2Type;
  quantity: number;
  price: number;
  foodNameSnapshot: string;
  foodUnitSnapshot: string;
  foodPriceSnapshot: number;
  totalPriceDetail: number;
}

export interface OrderSheetDetailCreateRequestType {
  foodId: number;
  quantity: number;
  price: number;
  foodNameSnapshot: string;
  foodUnitSnapshot: string;
  foodPriceSnapshot: number;
  totalPriceDetail: number;
}
