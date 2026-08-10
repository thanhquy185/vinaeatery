import type { RevenueTypeEnum, TimelineEnum } from "../constants/enums";
import type { PieChartProps } from "../constants/props";
import type { RestaurantSubInfoResponseType } from "./RestaurantType";

export interface RevenueRequestType {
  restaurantId: number;
  type: RevenueTypeEnum;
  timeline: TimelineEnum;
  timeDetail: string;
}

interface RevenueCardResponseType {
  total: number;
  average: number;
  max: number;
  min: number;
}

interface RevenueBarChartResponseType {
  xaxis: string[];
  series: number[];
}

interface RevenuePieChartResponseType {
  data: PieChartProps[];
}

interface RevenueChartResponseType {
  bar: RevenueBarChartResponseType;
  pie: RevenuePieChartResponseType;
}

export interface RevenueBillTableBodyResponseType {
  label: string;
  start: string;
  end: string;
  bill: number;
  quantity: number;
  revenue: number;
}

export interface RevenueBillTableFootResponseType {
  totalBill: number;
  totalQuantity: number;
  totalRevenue: number;
}

export interface RevenueFoodTableBodyResponseType {
  name: string;
  price: number;
  quantity: number;
  revenue: number;
  rowSpan: number;
}

export interface RevenueFoodTableFootResponseType {
  totalQuantity: number;
  totalRevenue: number;
}

export interface RevenueTableTableBodyResponseType {
  tableName: string;
  bill: number;
  quantity: number;
  revenue: number;
}

export interface RevenueTableTableFootResponseType {
  totalBill: number;
  totalQuantity: number;
  totalRevenue: number;
}

interface RevenueTableResponseType {
  billTableBody: RevenueBillTableBodyResponseType[];
  billTableFoot: RevenueBillTableFootResponseType;
  foodTableBody: RevenueFoodTableBodyResponseType[];
  foodTableFoot: RevenueFoodTableFootResponseType;
  tableTableBody: RevenueTableTableBodyResponseType[];
  tableTableFoot: RevenueTableTableFootResponseType;
}

export interface RevenueResponseType {
  restaurant: RestaurantSubInfoResponseType;
  dateStart: string;
  dateEnd: string;
  card: RevenueCardResponseType;
  chart: RevenueChartResponseType;
  table: RevenueTableResponseType;
}
