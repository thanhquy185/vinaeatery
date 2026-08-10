import type { FoodInfoResponseType } from "./FoodType";
import type { IngredientInfoResponseType } from "./IngredientType";

interface RecipeIdEntityType {
  foodId: number;
  ingredient: number;
}

export interface RecipeEntityType {
  id: RecipeIdEntityType;
  food: FoodInfoResponseType;
  ingredient: IngredientInfoResponseType;
  quantity: number;
  note: string;
}

export interface RecipeDetailResponseType {
  ingredient: IngredientInfoResponseType;
  quantity: number;
  note: string;
}

export interface RecipeCreateRequestType {
  ingredientId: number;
  quantity: number;
  note: string;
}
export interface RecipeUpdateRequestType {
  ingredientId: number;
  quantity: number;
  note: string;
}
