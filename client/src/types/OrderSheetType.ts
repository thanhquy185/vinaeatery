import type { OrderSheetStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  UseTableEntityType,
  UseTableInfoResponseType,
} from "./UseTableType";
import type {
  EmployeeEntityType,
  EmployeeSubInfoResponseType,
} from "./EmployeeType";
import type {
  OrderSheetDDetailResponseType,
  OrderSheetDetailCreateRequestType,
  OrderSheetDetailEntityType,
} from "./OrderSheetDetailType";

export interface OrderSheetEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  useTable: UseTableEntityType;
  employee: EmployeeEntityType;
  createAt: string;
  serviceAt: string;
  cancelAt: string;
  totalPrice: number;
  note: string;
  message: string;
  status: OrderSheetStatusEnum;
  orderSheetDetails: OrderSheetDetailEntityType[];
}

export interface OrderSheetDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  useTable: UseTableInfoResponseType;
  employee: EmployeeSubInfoResponseType;
  createAt: string;
  serviceAt: string;
  cancelAt: string;
  totalPrice: number;
  note: string;
  message: string;
  status: OrderSheetStatusEnum;
  orderSheetDetails: OrderSheetDDetailResponseType[];
}

export interface OrderSheetSummaryResponseType {
  id: number;
  useTable: UseTableInfoResponseType;
  createAt: string;
  serviceAt: string;
  cancelAt: string;
  totalPrice: number;
  note: string;
  message: string;
  status: OrderSheetStatusEnum;
}

export interface OrderSheetInfoResponseType {
  id: number;
  createAt: string;
  serviceAt: string;
  cancelAt: string;
  totalPrice: number;
  note: string;
  message: string;
  status: OrderSheetStatusEnum;
  orderSheetDetails: OrderSheetDDetailResponseType[];
}

export interface OrderSheetCreateRequestType {
  restaurantId: number;
  useTableId: number;
  createAt: string;
  totalPrice: number;
  note: string;
  status: OrderSheetStatusEnum;
  orderSheetDetails: OrderSheetDetailCreateRequestType[];
}

export interface OrderSheetUpdateStatusRequestType {
  id: number;
  serviceAt: string | undefined;
  cancelAt: string | undefined;
  employeeId: number | undefined;
  message: string | undefined;
  status: OrderSheetStatusEnum;
}
