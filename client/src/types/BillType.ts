import type { BillPaymentStatusEnum, BillStatusEnum } from "../constants/enums";
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
import type {
  PaymentMethodEntityType,
  PaymentMethodInfoResponseType,
} from "./PaymentMethodType";
import type {
  BillDetailCreateRequestType,
  BillDetailEntityType,
} from "./BillDetailType";

export interface BillEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  employee: EmployeeEntityType;
  customer: CustomerEntityType;
  createAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  status: BillStatusEnum;
  paymentId: string;
  paymentMethod: PaymentMethodEntityType;
  paymentAt: string;
  paymentTotalPrice: number;
  paymentStatus: BillPaymentStatusEnum;
  billDetails: BillDetailEntityType[];
}

export interface BillDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  employee: EmployeeSubInfoResponseType;
  customer: CustomerInfoResponseType;
  createAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  status: BillStatusEnum;
  paymentId: string;
  paymentMethod: PaymentMethodInfoResponseType;
  paymentAt: string;
  paymentTotalPrice: number;
  paymentStatus: BillPaymentStatusEnum;
  billDetails: BillDetailEntityType[];
}

export interface BillSummaryResponseType {
  id: number;
  createAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  status: BillStatusEnum;
  paymentId: string;
  paymentMethod: PaymentMethodEntityType;
  paymentAt: string;
  paymentTotalPrice: number;
  paymentStatus: BillPaymentStatusEnum;
}

export interface BillInfoResponseType {
  id: number;
  createAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  status: BillStatusEnum;
  paymentId: string;
  paymentMethod: PaymentMethodEntityType;
  paymentAt: string;
  paymentTotalPrice: number;
  paymentStatus: BillPaymentStatusEnum;
}

export interface BillCustomerResponseType {
  id: number;
  createAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  status: BillStatusEnum;
  paymentId: string;
  paymentMethod: PaymentMethodEntityType;
  paymentAt: string;
  paymentTotalPrice: number;
  paymentStatus: BillPaymentStatusEnum;
}

export interface BillCreateRequestType {
  id: number;
  restaurantId: number;
  employeeId: number;
  customerId: number;
  createAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  status: BillStatusEnum;
  paymentId: string;
  paymentMethodId: number;
  paymentAt: string;
  paymentTotalPrice: number;
  paymentStatus: BillPaymentStatusEnum;
  billDetails: BillDetailCreateRequestType[];
}

export interface BillUpdateStatusRequestType {
  id: number;
  status: BillStatusEnum;
}
