import type { RcFile } from "antd/es/upload";
import type {
  ManagerCrudResponseType,
  ManagerDetailResponseType,
} from "../types/ManagerType";
import type { CustomerDetailResponseType } from "../types/CustomerType";
import type { FloorCrudResponseType } from "../types/FloorType";
import type { CategoryTableCrudResponseType } from "../types/CategoryTableType";
import type { SupplierCrudResponseType } from "../types/SupplierType";
import type { CategoryIngredientCrudResponseType } from "../types/CategoryIngredientType";
import type { CategoryFoodCrudResponseType } from "../types/CategoryFoodType";
import type {
  EmployeeCrudResponseType,
  EmployeeDetailResponseType,
} from "../types/EmployeeType";
import type { Dispatch, SetStateAction } from "react";
import type { QueryClient, UseMutationResult } from "@tanstack/react-query";
import type { Client } from "stompjs";
import type { RoleCrudResponseType } from "../types/RoleType";
import type { PermissionCrudResponseType } from "../types/PermissionType";
import type { IngredientCrudResponseType } from "../types/IngredientType";
import type { UserDetailResponseType } from "../types/UserType";
import type { FoodCrudResponseType } from "../types/FoodType";
import type { PaymentMethodCrudResponseType } from "../types/PaymentMethodType";
import type {
  UseTableOccupiedInfoRequestType,
  UseTableCustomerResponseType,
  UseTableDetailResponseType,
} from "../types/UseTableType";
import type { ShoppingCartRequestType } from "../types/ShoppingCartType";
import type { FormInstance } from "antd";
import type {
  PaymentMachineDetailResponseType,
  PaymentMachineUpdateRequestType,
} from "../types/PaymentMachineType";
import type { RestResponseType } from "../types/RestResponseType";
import type { ExpenseTypeEnum, RevenueTypeEnum } from "./enums";

export type ReactQueryMutationProps<T> = {
  type?: "create" | "update" | "lock" | "unlock" | "change-password";
  values?: T;
  objectId?: string | number;
  imageFile?: File | RcFile;
  imageFiles?: File[] | RcFile[];
  details?: any[];
  // totalPrice?: number;
  // details?: OrderDetailType | InputTicketDetailFormatResponseType;
};

export type DashboardFilterTimeProps = { timeline: string; timeDetail: string };

export type PieChartProps = { id: number; value: number; label: string };

export type PublicPageProps = {
  isCustomer: boolean;
  customerLogin: CustomerDetailResponseType | undefined;
};

export type CallFoodPageProps = {
  queryKey?: any[];
  queryClient?: QueryClient;
  shoppingCart?: ShoppingCartRequestType[];
  setShoppingCart?: Dispatch<SetStateAction<ShoppingCartRequestType[]>>;
  currentUseTable: UseTableCustomerResponseType;
  stomp?: React.RefObject<Client | null>;
};

export type PaymentMachinePageProps = {
  paymentMachine: PaymentMachineDetailResponseType;
  queryKey?: string;
  methodImage?: string;
  methodTitle?: string;
  paymentId?: string;
  paymentLogo?: string;
  paymentQRCodeUrl?: string;
  paymentResponseTime?: number;
  paymentTotalPrice?: number;
  updateMutation?: UseMutationResult<
    RestResponseType<PaymentMachineDetailResponseType>,
    string,
    ReactQueryMutationProps<PaymentMachineUpdateRequestType>,
    void
  >;
  stomp?: React.RefObject<Client | null>;
  updateMethodInfo?: ({
    image,
    title,
  }: {
    image: string;
    title: string;
  }) => void;
  updatePaymentInfo?: ({
    id,
    logo,
    qrCodeUrl,
    responseTime,
    totalPrice,
  }: {
    id: string;
    logo: string;
    qrCodeUrl: string;
    responseTime: number;
    totalPrice: number;
  }) => void;
  score01Value?: number;
  score02Value?: number;
  score03Value?: number;
  score04Value?: number;
  score05Value?: number;
  commentValue?: string;
  setScore01Value?: Dispatch<SetStateAction<number>>;
  setScore02Value?: Dispatch<SetStateAction<number>>;
  setScore03Value?: Dispatch<SetStateAction<number>>;
  setScore04Value?: Dispatch<SetStateAction<number>>;
  setScore05Value?: Dispatch<SetStateAction<number>>;
  setCommentValue?: Dispatch<SetStateAction<string>>;
  handleClickExperienceButtons?: (
    button: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

export type AdminManagerPageProps = {
  isManager?: boolean;
  adminLogin?: UserDetailResponseType;
  infoLogin?:
    | ManagerDetailResponseType
    | EmployeeDetailResponseType
    | CustomerDetailResponseType;
  functionId: number;
  nameVN: string;
  nameEN: string;
};

export type FilterDataProps = {
  page?: number;
  size?: number;
  sort?: string;
  findType?: string;
  findValue?: string;
  timeValue?: [string, string];
  arriveAtValue?: [string, string];
  floorValue?: string[];
  categoryValue?: string[];
  surchargeTypeValue?: string[];
  statusValue?: string[];
  id?: number;
  restaurantId?: number;
  managerId?: number;
  customerId?: number;
  useTableId?: number;
  tableId?: number;
  roleValue?: string[];
  methodValue?: string;
  isUsingValue?: string[];
  handlePaymentId?: number;
  isEmployeeHandleValue?: boolean;
  orderId?: string | number;
  orderAmount?: string | number;
  revenueType?: RevenueTypeEnum;
  expenseType?: ExpenseTypeEnum;
  timeline?: string;
  timeDetail?: string;
};

export type CrudObjectModalProps = {
  stomp?: React.RefObject<Client | null>;
  objectVN?: string;
  objectEN: string;
  objectENPrimary?: string;
  defaultLabels?: any;
  defaultInputs?: any;
  isManager?: boolean;
  restaurantId?: number;
  validActions?: string;
  data?: any;
  dataForCrud?: {
    infoLogin?:
      | ManagerDetailResponseType
      | CustomerDetailResponseType
      | EmployeeDetailResponseType;
    paymentMethods?: PaymentMethodCrudResponseType[];
    managers?: ManagerCrudResponseType[];
    floors?: FloorCrudResponseType[];
    categoryTables?: CategoryTableCrudResponseType[];
    suppliers?: SupplierCrudResponseType[];
    foods?: FoodCrudResponseType[];
    categoryFoods?: CategoryFoodCrudResponseType[];
    categoryIngredients?: CategoryIngredientCrudResponseType[];
    ingredients?: IngredientCrudResponseType[];
    units?: string[];
    roles?: RoleCrudResponseType[];
    permissions?: PermissionCrudResponseType[];
    employees?: EmployeeCrudResponseType[];
  };
  tableNoActionsFormat?: {
    widths?: string[];
    columns?: string[];
    attributes?: string[];
    format?: string[];
  };
  fieldId?: number;
  fieldStatus?: string;
  callApiToUpdateUseTable?: (
    payload: HandleUpdateStatusUseTableProps,
  ) => Promise<any>;
  closeModal: () => void;
};

export type ManagerHandleUpdateStatusUseTableProps = {
  restaurantId?: number;
  useTableId?: number;
  useTable?: UseTableDetailResponseType;
  form?: FormInstance;
  tableIsOccupied?: boolean;
  setTableIsOccupied?: Dispatch<SetStateAction<boolean>>;
  infoRequest?: UseTableOccupiedInfoRequestType | null;
  setInfoRequest?: Dispatch<
    SetStateAction<UseTableOccupiedInfoRequestType | null>
  >;
  customerHasAccount?: boolean;
  setCustomerHasAccount?: Dispatch<SetStateAction<boolean>>;
  menuAlaCarte?: boolean;
  setMenuAlaCarte?: Dispatch<SetStateAction<boolean>>;
  callApiToUpdateUseTable?: (
    payload: HandleUpdateStatusUseTableProps,
  ) => Promise<any>;
  clickBack?: () => void;
};

export type HandleUpdateStatusUseTableProps = {
  id?: number;
  menuId?: number;
  reservationId?: number;
  tableId?: number;
  employeeId?: number;
  customerId?: number;
  customerFullname?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAdult?: number;
  customerChild?: number;
  customerGuests?: number;
  button: HTMLElement;
  value: string;
};
