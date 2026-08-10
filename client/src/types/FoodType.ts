import type { RcFile } from "antd/es/upload";
import type { FoodStatusEnum, FoodUnitEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  CategoryFoodEntityType,
  CategoryFoodInfoResponseType,
} from "./CategoryFoodType";
import type {
  RecipeCreateRequestType,
  RecipeDetailResponseType,
  RecipeEntityType,
  RecipeUpdateRequestType,
} from "./RecipeType";

export interface FoodEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  categoryFood: CategoryFoodEntityType;
  image: string;
  name: string;
  unit: FoodUnitEnum;
  price: number;
  description: string;
  status: FoodStatusEnum;
  recipes: RecipeEntityType[];
}

export interface FoodDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  categoryFood: CategoryFoodInfoResponseType;
  image: string;
  name: string;
  unit: FoodUnitEnum;
  price: number;
  description: string;
  status: FoodStatusEnum;
  recipes: RecipeDetailResponseType[];
}

export interface FoodSummaryResponseType {
  id: number;
  categoryFood: CategoryFoodInfoResponseType;
  image: string;
  name: string;
  unit: FoodUnitEnum;
  price: number;
  status: FoodStatusEnum;
}

export interface FoodInfoResponseType {
  id: number;
  categoryFood: CategoryFoodInfoResponseType;
  image: string;
  name: string;
  unit: FoodUnitEnum;
  price: number;
  description: string;
  status: FoodStatusEnum;
}

export interface FoodInfoResponse2Type {
  id: number;
  categoryFood: CategoryFoodInfoResponseType;
  image: string;
  name: string;
  unit: FoodUnitEnum;
  price: number;
  description: string;
  status: FoodStatusEnum;
  recipes: RecipeDetailResponseType[];
}

export interface FoodCrudResponseType {
  id: number;
  categoryFood: CategoryFoodInfoResponseType;
  image: string;
  name: string;
  unit: FoodUnitEnum;
  price: number;
  description: string;
}

export interface FoodCreateRequestType {
  restaurantId: number;
  categoryFoodId: number;
  image: File | RcFile | undefined;
  name: string;
  unit: FoodUnitEnum;
  price: number;
  description: string;
  status: FoodStatusEnum;
  recipes: RecipeCreateRequestType[];
}

export interface FoodUpdateRequestType {
  id: number;
  categoryFoodId: number;
  image: File | RcFile | undefined;
  name: string;
  unit: FoodUnitEnum;
  price: number;
  description: string;
  recipes: RecipeUpdateRequestType[];
}

export interface FoodDeleteRequestType {
  id: number;
  status: FoodStatusEnum;
}
