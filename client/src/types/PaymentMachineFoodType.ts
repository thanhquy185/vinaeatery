import type { FoodEntityType, FoodInfoResponse2Type } from "./FoodType";

interface PaymentMachineFoodIdEntityType {
  paymentMachineFoodId: number;
  foodId: number;
}

export interface PaymentMachineFoodEntityType {
  id: PaymentMachineFoodIdEntityType;
  food: FoodEntityType;
  quantity: number;
  price: number;
  foodNameSnapshot: string;
  foodUnitSnapshot: string;
  foodPriceSnapshot: number;
  totalPriceDetail: number;
}

export interface PaymentMachineFoodDetailResponseType {
  food: FoodInfoResponse2Type;
  quantity: number;
  price: number;
  foodNameSnapshot: string;
  foodUnitSnapshot: string;
  foodPriceSnapshot: number;
  totalPriceDetail: number;
}
