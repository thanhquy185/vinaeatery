import type { TimelineEnum } from "../constants/enums";
import type { RestaurantSubInfoResponseType } from "./RestaurantType";

export interface ProfitRequestType {
  restaurantId: number;
  timeline: TimelineEnum;
  timeDetail: string;
}

interface ProfitLineChartResponseType {
  revenueLine: number[];
  expenseLine: number[];
  profitLine: number[];
  xlabels: string[];
}

export interface ProfitTableBodyResponseType {
  label: string;
  start: string;
  end: string;
  revenue: number;
  expense: number;
  profit: number;
}

export interface ProfitTableFootResponseType {
  totalRevenue: number;
  totalExpense: number;
  totalProfit: number;
}

interface ProfitTableResponseType {
  body: ProfitTableBodyResponseType[];
  foot: ProfitTableFootResponseType;
}

export interface ProfitResponseType {
  restaurant: RestaurantSubInfoResponseType;
  dateStart: string;
  dateEnd: string;
  lineChart: ProfitLineChartResponseType;
  table: ProfitTableResponseType;
}
