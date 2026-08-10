import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  CustomerEntityType,
  CustomerInfoResponseType,
} from "./CustomerType";

export interface FeedbackEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  customer: CustomerEntityType;
  at: string;
  experience: string;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  score5: number;
  message: string;
}

export interface FeedbackDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  customer: CustomerInfoResponseType;
  at: string;
  experience: string;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  score5: number;
  message: string;
}

export interface FeedbackInfoResponseType {
  id: number;
  customer: CustomerInfoResponseType;
  at: string;
  experience: string;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  score5: number;
  message: string;
}
