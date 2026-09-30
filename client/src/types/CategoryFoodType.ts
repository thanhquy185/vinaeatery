import type { RcFile } from "antd/es/upload";
import type { CommonStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";

export interface CategoryFoodEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  imageUrl: string;
  imagePublicId: string;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryFoodDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  imageUrl: string;
  imagePublicId: string;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryFoodSummaryResponseType {
  id: number;
  imageUrl: string;
  imagePublicId: string;
  name: string;
  status: CommonStatusEnum;
}

export interface CategoryFoodInfoResponseType {
  id: number;
  imageUrl: string;
  imagePublicId: string;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryFoodCrudResponseType {
  id: number;
  imageUrl: string;
  imagePublicId: string;
  name: string;
  description: string;
}

export interface CategoryFoodCreateRequestType {
  restaurantId: number;
  image: File | RcFile | undefined;
  name: string;
  description: string;
  status: CommonStatusEnum;
}

export interface CategoryFoodUpdateRequestType {
  id: number;
  image: File | RcFile | undefined;
  name: string;
  description: string;
}

export interface CategoryFoodDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
