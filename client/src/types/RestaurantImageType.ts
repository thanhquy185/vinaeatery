import type { RcFile } from "antd/es/upload";
import type { RestaurantEntityType } from "./RestaurantType";

interface RestaurantImageIdEntityType {
  restaurantId: number;
  image: string;
}

export interface RestaurantImageEntityType {
  id: RestaurantImageIdEntityType;
  restaurant: RestaurantEntityType;
  image: string;
}

export interface RestaurantImageDetailResponseType {
  image: string;
}

export interface RestaurantImageCreateRequestType {
  image: File | RcFile | undefined;
}

export interface RestaurantImageUpdateRequestType {
  image: File | RcFile | undefined;
}
