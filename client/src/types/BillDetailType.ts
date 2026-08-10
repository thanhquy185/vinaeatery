import type { BillEntityType } from "./BillType";
import type { FoodEntityType, FoodInfoResponseType } from "./FoodType";

interface BillDetailIdEntityType {
  billId: number;
  foodId: number;
}

export interface BillDetailEntityType {
  id: BillDetailIdEntityType;
  bill: BillEntityType;
  food: FoodEntityType;
  quantity: number;
  price: number;
  foodNameSnapshot: string;
  foodUnitSnapshot: string;
  foodPriceSnapshot: number;
  totalPriceDetail: number;
}

export interface BillDDetailResponseType {
  food: FoodInfoResponseType;
  quantity: number;
  price: number;
  foodNameSnapshot: string;
  foodUnitSnapshot: string;
  foodPriceSnapshot: number;
  totalPriceDetail: number;
}

export interface BillDetailCreateRequestType {
  foodId: number;
  quantity: number;
  price: number;
  foodNameSnapshot: string;
  foodUnitSnapshot: string;
  foodPriceSnapshot: number;
  totalPriceDetail: number;
}
