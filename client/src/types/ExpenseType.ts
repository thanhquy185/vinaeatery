import type { ExpenseTypeEnum, TimelineEnum } from "../constants/enums";
import type { PieChartProps } from "../constants/props";
import type { RestaurantSubInfoResponseType } from "./RestaurantType";

export interface ExpenseRequestType {
  restaurantId: number;
  type: ExpenseTypeEnum;
  timeline: TimelineEnum;
  timeDetail: string;
}

interface ExpenseCardResponseType {
  total: number;
  average: number;
  max: number;
  min: number;
}

interface ExpenseBarChartResponseType {
  xaxis: string[];
  series: number[];
}

interface ExpensePieChartResponseType {
  data: PieChartProps[];
}

interface ExpenseChartResponseType {
  bar: ExpenseBarChartResponseType;
  pie: ExpensePieChartResponseType;
}

export interface ExpenseInputTicketTableBodyResponseType {
  label: string;
  start: string;
  end: string;
  inputTicket: number;
  quantity: number;
  expense: number;
}

export interface ExpenseInputTicketTableFootResponseType {
  totalInputTicket: number;
  totalQuantity: number;
  totalExpense: number;
}

export interface ExpenseIngredientTableBodyResponseType {
  name: string;
  inputPrice: number;
  quantity: number;
  expense: number;
  rowSpan: number;
}

export interface ExpenseIngredientTableFootResponseType {
  totalQuantity: number;
  totalExpense: number;
}

export interface ExpenseSupplierTableBodyResponseType {
  tableName: string;
  inputTicket: number;
  quantity: number;
  expense: number;
}

export interface ExpenseSupplierTableFootResponseType {
  totalInputTicket: number;
  totalQuantity: number;
  totalExpense: number;
}

interface ExpenseTableResponseType {
  inputTicketTableBody: ExpenseInputTicketTableBodyResponseType[];
  inputTicketTableFoot: ExpenseInputTicketTableFootResponseType;
  ingredientTableBody: ExpenseIngredientTableBodyResponseType[];
  ingredientTableFoot: ExpenseIngredientTableFootResponseType;
  supplierTableBody: ExpenseSupplierTableBodyResponseType[];
  supplierTableFoot: ExpenseSupplierTableFootResponseType;
}

export interface ExpenseResponseType {
  restaurant: RestaurantSubInfoResponseType;
  dateStart: string;
  dateEnd: string;
  card: ExpenseCardResponseType;
  chart: ExpenseChartResponseType;
  table: ExpenseTableResponseType;
}
