import type { Dispatch, SetStateAction } from "react";
import type { RcFile } from "antd/es/upload";
import type {
  CategoryAllowanceType,
  CategoryFoodType,
  CategoryIngredientType,
  CategoryInsuranceType,
  CategoryPermissionTicketType,
  CategoryRewardPunishType,
  CategoryTableType,
  EmployeeType,
  FloorType,
  InputTicketDetailType,
  ManagerType,
  OrderDetailType,
  PermissionDetailType,
  PermissionType,
  RecipeType,
  RoleHistoryType,
  RoleType,
  ScheduleType,
  ShiftType,
  SupplierType,
  UserType,
} from "./types";
import type { RecipeTableProps } from "../pages/manager/manager-food/foods";
import type { InputTicketDetailsTableProps } from "../pages/manager/manager-food/input-tickets";
import type { OrderDetailsTableProps } from "../pages/manager/active/orders";
import type { HandleUseTableProps } from "../pages/manager/active/use-tables";

// React Query Mutation Props
export type ReactQueryMutationProps<T> = {
  type?: "create" | "update" | "lock" | "unlock" | "change-password";
  values?: T;
  objectId?: string | number;
  imageFile?: File | RcFile;
  imageFiles?: File[] | RcFile[];
  details?: any[];
  // totalPrice?: number;
  // details?: OrderDetailType | InputTicketDetailType;
};

// Manager Page Props
export type ManagerPageProps = {
  infoLogin: EmployeeType;
  functionId: number;
  nameVN: string;
  nameEN: string;
};

// Filter Data Props
export type FilterDataProps = {
  findType?: string;
  findValue?: string;
  timeValue?: [string, string];
  arriveAtValue?: [string, string];
  floorValue?: string[];
  categoryValue?: string[];
  customerCardValue?: string[];
  surchargeTypeValue?: string[];
  statusValue?: string[];
  restaurantId?: number;
  useTableId?: number;
  tableId?: number;
  roleValue?: string[];
  methodValue?: string;
  isUsingValue?: string[];
  handlePaymentId?: number;
  isEmployeeHandleValue?: boolean;
  orderId?: string | number;
  orderAmount?: string | number;
};

// Modal Props
export type CrudObjectModalProps = {
  objectVN?: string;
  objectEN: string;
  defaultLabels?: any;
  defaultInputs?: any;
  isManager?: boolean;
  restaurantId?: number;
  validActions?: string;
  data?: any;
  dataForCrud?: {
    infoLogin?: EmployeeType;
    managers?: ManagerType[];
    users?: UserType[];
    orderDetails?: OrderDetailType[];
    floors?: FloorType[];
    categoryTables?: CategoryTableType[];
    inputTicketDetails?: InputTicketDetailType[];
    suppliers?: SupplierType[];
    categoryFoods?: CategoryFoodType[];
    categoryIngredients?: CategoryIngredientType[];
    recipes?: RecipeType[];
    units?: string[];
    categoryAllowances?: CategoryAllowanceType[];
    allowanceMonthIsActives?: string[];
    categoryInsurances?: CategoryInsuranceType[];
    insuranceMonthIsActives?: string[];
    schedules?: ScheduleType[];
    shifts?: ShiftType[];
    categoryPermissionTickets?: CategoryPermissionTicketType[];
    categoryRewardPunishes?: CategoryRewardPunishType[];
    roles?: RoleType[];
    roleHistories?: RoleHistoryType[];
    permissions?: PermissionType[];
    permissionHistories?: PermissionDetailType[];
    employees?: EmployeeType[];
  };
  tableNoActionsFormat?: {
    widths?: string[];
    columns?: string[];
    attributes?: string[];
    format?: string[];
  };
  modalForCrud?: {
    orderDetails?: {
      openModalCreate?: ({
        orderDetails,
        setOrderDetails,
      }: OrderDetailsTableProps) => void;
      openModalDelete?: ({
        orderDetails,
        setOrderDetails,
      }: OrderDetailsTableProps) => void;
    };
    inputTicketDetails?: {
      openModalCreate?: ({
        inputTicketDetails,
        setInputTicketDetails,
      }: InputTicketDetailsTableProps) => void;
      openModalDelete?: ({
        inputTicketDetails,
        setInputTicketDetails,
      }: InputTicketDetailsTableProps) => void;
    };
    recipes?: {
      openModalCreate?: ({ recipes, setRecipes }: RecipeTableProps) => void;
      openModalDelete?: ({ recipes, setRecipes }: RecipeTableProps) => void;
    };
    roleHistories?: {
      openModalDetail?: ({
        roleHistories,
      }: {
        roleHistories?: RoleHistoryType[];
      }) => void;
    };
  };
  orderDetails?: OrderDetailType[];
  setOrderDetails?: Dispatch<SetStateAction<OrderDetailType[]>>;
  inputTicketDetails?: InputTicketDetailType[];
  setInputTicketDetails?: Dispatch<SetStateAction<InputTicketDetailType[]>>;
  recipes?: RecipeType[];
  setRecipes?: Dispatch<SetStateAction<RecipeType[]>>;
  roleHistories?: RoleHistoryType[];
  fieldId?: number;
  fieldStatus?: string;
  callApiToUpdateUseTable?: (payload: HandleUseTableProps) => Promise<any>;
  closeModal: () => void;
};

// Manager Handle Use Table Props
export type ManagerHandleUseTableProps = {
  restaurantId?: number;
  useTableId?: number;
  callApiToUpdateUseTable?: (payload: HandleUseTableProps) => Promise<any>;
  clickBack?: () => void;
};

// Dashboard Filter Time Props
export type DashboardFilterTimeProps = { timeline: string; timeDetail: string };

// Pie Chart Props
export type PieChartProps = { id: number; value: number; label: string };
