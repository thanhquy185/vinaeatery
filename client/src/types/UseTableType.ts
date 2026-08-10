import type { UseTableStatusEnum } from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  MenuCustomerResponseType,
  MenuEntityType,
  MenuInfoResponseType,
} from "./MenuType";
import type { MessageEntityType, MessageInfoResponseType } from "./MessageType";
import type { BillEntityType, BillInfoResponseType } from "./BillType";
import type {
  ReservationEntityType,
  ReservationInfoResponseType,
} from "./ReservationType";
import type { TableEntityType, TableInfoResponseType } from "./TableType";
import type {
  EmployeeEntityType,
  EmployeeSubInfoResponseType,
} from "./EmployeeType";
import type {
  CustomerEntityType,
  CustomerInfoResponseType,
} from "./CustomerType";
import type { OrderSheetInfoResponseType } from "./OrderSheetType";
import type {
  PaymentMachineEntityType,
  PaymentMachineInfoResponseType,
} from "./PaymentMachineType";
import type {
  FeedbackEntityType,
  FeedbackInfoResponseType,
} from "./FeedbackType";

export interface UseTableEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  paymentMachine: PaymentMachineEntityType;
  feedback: FeedbackEntityType;
  menu: MenuEntityType;
  message: MessageEntityType;
  bill: BillEntityType;
  reservation: ReservationEntityType;
  table: TableEntityType;
  employee: EmployeeEntityType;
  customer: CustomerEntityType;
  startAt: string;
  endAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerAdult: number;
  customerChild: number;
  customerGuests: number;
  status: UseTableStatusEnum;
}

export interface UseTableDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  paymentMachine: PaymentMachineInfoResponseType;
  feedback: FeedbackInfoResponseType;
  menu: MenuInfoResponseType;
  message: MessageInfoResponseType;
  bill: BillInfoResponseType;
  reservation: ReservationInfoResponseType;
  table: TableInfoResponseType;
  employee: EmployeeSubInfoResponseType;
  customer: CustomerInfoResponseType;
  startAt: string;
  endAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerAdult: number;
  customerChild: number;
  customerGuests: number;
  status: UseTableStatusEnum;
  orderSheets: OrderSheetInfoResponseType[];
}

export interface UseTableCustomerResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  menu: MenuCustomerResponseType;
  message: MessageInfoResponseType;
  table: TableInfoResponseType;
  startAt: string;
  endAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerAdult: number;
  customerChild: number;
  customerGuests: number;
  status: UseTableStatusEnum;
  orderSheets: OrderSheetInfoResponseType[];
}

export interface UseTableSummaryResponseType {
  id: number;
  table: TableInfoResponseType;
  startAt: string;
  endAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerAdult: number;
  customerChild: number;
  customerGuests: number;
  status: UseTableStatusEnum;
}

export interface UseTableInfoResponseType {
  id: number;
  table: TableInfoResponseType;
  startAt: string;
  endAt: string;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerAdult: number;
  customerChild: number;
  customerGuests: number;
  status: UseTableStatusEnum;
}

export interface UseTableUpdateStatusRequestType {
  id: number;
  menuId: number | undefined;
  reservationId: number | undefined;
  employeeId: number;
  customerId: number | undefined;
  endAt: string;
  customerFullname: string | undefined;
  customerPhone: string | undefined;
  customerEmail: string | undefined;
  customerAdult: number | undefined;
  customerChild: number | undefined;
  customerGuests: number | undefined;
  status: UseTableStatusEnum;
}

export interface UseTableOccupiedInfoRequestType {
  menuId: number;
  customerId: number;
  customerFullname: string;
  customerPhone: string;
  customerEmail: string;
  customerAdult: number;
  customerChild: number;
  customerGuests: number;
}
