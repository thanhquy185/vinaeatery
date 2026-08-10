import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  EmployeeEntityType,
  EmployeeSubInfoResponseType,
} from "./EmployeeType";
import type {
  SupplierEntityType,
  SupplierInfoResponseType,
} from "./SupplierType";
import type {
  InputTicketDDetailResponseType,
  InputTicketDetailCreateRequestType,
  InputTicketDetailEntityType,
} from "./InputTicketDetailType";
import type {
  InputTicketPaymentStatusEnum,
  InputTicketStatusEnum,
} from "../constants/enums";

export interface InputTicketEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  employee: EmployeeEntityType;
  supplier: SupplierEntityType;
  createAt: string;
  totalInputPrice: number;
  paymentStatus: InputTicketPaymentStatusEnum;
  status: InputTicketStatusEnum;
  inputTicketDetails: InputTicketDetailEntityType[];
}

export interface InputTicketDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  employee: EmployeeSubInfoResponseType;
  supplier: SupplierInfoResponseType;
  createAt: string;
  totalInputPrice: number;
  paymentStatus: InputTicketPaymentStatusEnum;
  status: InputTicketStatusEnum;
  inputTicketDetails: InputTicketDDetailResponseType[];
}

export interface InputTicketSummaryResponseType {
  id: number;
  employee: EmployeeSubInfoResponseType;
  supplier: SupplierInfoResponseType;
  createAt: string;
  totalInputPrice: number;
  paymentStatus: InputTicketPaymentStatusEnum;
  status: InputTicketStatusEnum;
}

export interface InputTicketInfoResponseType {
  id: number;
  employee: EmployeeSubInfoResponseType;
  supplier: SupplierInfoResponseType;
  createAt: string;
  totalInputPrice: number;
  paymentStatus: InputTicketPaymentStatusEnum;
  status: InputTicketStatusEnum;
}

export interface InputTicketCreateRequestType {
  id: number;
  restaurantId: number;
  employeeId: number;
  supplierId: number;
  createAt: string;
  totalInputPrice: number;
  paymentStatus: InputTicketPaymentStatusEnum;
  status: InputTicketStatusEnum;
  inputTicketDetails: InputTicketDetailCreateRequestType[];
}

export interface InputTicketUpdatePaymentStatusRequestType {
  id: number;
  paymentStatus: InputTicketPaymentStatusEnum;
}

export interface InputTicketUpdateStatusRequestType {
  id: number;
  status: InputTicketStatusEnum;
}
