import type { UseFoodStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  FoodEntityType,
  FoodInfoResponse2Type,
  FoodInfoResponseType,
} from "./FoodType";
import type {
  EmployeeEntityType,
  EmployeeSubInfoResponseType,
} from "./EmployeeType";

export interface UseFoodEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  food: FoodEntityType;
  employee: EmployeeEntityType;
  startAt: string;
  endAt: string;
  status: UseFoodStatusEnum;
}

export interface UseFoodDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  food: FoodInfoResponse2Type;
  employee: EmployeeSubInfoResponseType;
  startAt: string;
  endAt: string;
  status: UseFoodStatusEnum;
}

export interface UseFoodSummaryResponseType {
  id: number;
  food: FoodInfoResponseType;
  startAt: string;
  endAt: string;
  status: UseFoodStatusEnum;
}

export interface UseFoodUpdateStatusRequestType {
  id: number;
  employeeId: number;
  endAt: string;
  status: UseFoodStatusEnum;
}
