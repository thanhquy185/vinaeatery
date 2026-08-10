import type { CommonStatusEnum } from "../constants/enums";
import type { ManagerEntityType, ManagerInfoResponseType } from "./ManagerType";
import type { FoodInfoResponseType } from "./FoodType";
import type {
  RestaurantImageCreateRequestType,
  RestaurantImageDetailResponseType,
  RestaurantImageEntityType,
  RestaurantImageUpdateRequestType,
} from "./RestaurantImageType";

export interface RestaurantEntityType {
  id: number;
  manager: ManagerEntityType;
  openAt: string;
  closeAt: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
  images: RestaurantImageEntityType[];
}

export interface RestaurantDetailResponseType {
  id: number;
  manager: ManagerInfoResponseType;
  openAt: string;
  closeAt: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
  restaurantImages: RestaurantImageDetailResponseType[];
  foods: FoodInfoResponseType[];
}

export interface RestaurantSummaryResponseType {
  id: number;
  manager: ManagerInfoResponseType;
  name: string;
  phone: string;
  email: string;
  status: CommonStatusEnum;
  restaurantImages: RestaurantImageDetailResponseType[];
}

export interface RestaurantPublicResponseType {
  id: number;
  manager: ManagerInfoResponseType;
  thumbnail: string;
  openAt: string;
  closeAt: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
}

export interface RestaurantPublicDetailResponseType {
  id: number;
  manager: ManagerInfoResponseType;
  openAt: string;
  closeAt: string;
  thumbnail: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
  restaurantImages: RestaurantImageDetailResponseType[];
  foods: FoodInfoResponseType[];
}

export interface RestaurantManagerResponseType {
  id: number;
  openAt: string;
  closeAt: string;
  thumbnail: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
  restaurantImages: RestaurantImageDetailResponseType[];
}

export interface RestaurantInfoResponseType {
  id: number;
  manager: ManagerInfoResponseType;
  openAt: string;
  closeAt: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
}

export interface RestaurantSubInfoResponseType {
  id: number;
  openAt: string;
  closeAt: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
}

export interface RestaurantCrudResponseType {
  id: number;
  openAt: string;
  closeAt: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
  restaurantImages: RestaurantImageDetailResponseType[];
}

export interface RestaurantCreateRequestType {
  managerId: number;
  openAt: string;
  closeAt: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  status: CommonStatusEnum;
  images: RestaurantImageCreateRequestType[];
}

export interface RestaurantUpdateRequestType {
  id: number;
  managerId: number;
  openAt: string;
  closeAt: string;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
  description: string;
  images: RestaurantImageUpdateRequestType[];
}

export interface RestaurantDeleteRequestType {
  id: number;
  status: CommonStatusEnum;
}
