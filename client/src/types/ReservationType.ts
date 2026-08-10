import type { ReservationStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  EmployeeEntityType,
  EmployeeSubInfoResponseType,
} from "./EmployeeType";
import type {
  CustomerEntityType,
  CustomerInfoResponseType,
} from "./CustomerType";

export interface ReservationEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  employee: EmployeeEntityType;
  customer: CustomerEntityType;
  createAt: string;
  arriveAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
  status: ReservationStatusEnum;
}

export interface ReservationDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  employee: EmployeeSubInfoResponseType;
  customer: CustomerInfoResponseType;
  createAt: string;
  arriveAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
  status: ReservationStatusEnum;
}

export interface ReservationSummaryResponseType {
  id: number;
  createAt: string;
  arriveAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
  status: ReservationStatusEnum;
}

export interface ReservationCustomerResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  createAt: string;
  arriveAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
  status: ReservationStatusEnum;
}

export interface ReservationCrudResponseType {
  id: number;
  createAt: string;
  arriveAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
}

export interface ReservationInfoResponseType {
  id: number;
  createAt: string;
  arriveAt: string;
  customerId: number;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
  status: ReservationStatusEnum;
}

export interface ReservationCreateRequestType {
  restaurantId: number;
  employeeId: number;
  customerId: number;
  createAt: string;
  arriveAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
  status: ReservationStatusEnum;
}

export interface ReservationCustomerCreateRequestType {
  restaurantId: number;
  customerId: number;
  createAt: string;
  arriveAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
  status: ReservationStatusEnum;
}

export interface ReservationCustomerCreateRequestType {
  restaurantId: number;
  customerId: number;
  createAt: string;
  arriveAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerGuests: string;
  customerNote: string;
  status: ReservationStatusEnum;
}

export interface ReservationUpdateStatusRequestType {
  id: number;
  employeeId?: number;
  status: ReservationStatusEnum;
}
