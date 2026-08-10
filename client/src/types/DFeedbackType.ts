import type { TimelineEnum } from "../constants/enums";
import type { PieChartProps } from "../constants/props";
import type { RestaurantSubInfoResponseType } from "./RestaurantType";

export interface DFeedbackRequestType {
  restaurantId: number;
  timeline: TimelineEnum;
  timeDetail: string;
}

interface DFeedbackCardResponseType {
  total: number;
  average: number;
  max: number;
  min: number;
}

interface DFeedbackChartResponseType {
  data: PieChartProps[];
}

export interface DFeedbackTableBodyResponseType {
  name: string;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  score5: number;
}

export interface DFeedbackTableFootResponseType {
  totalScore1: number;
  totalScore2: number;
  totalScore3: number;
  totalScore4: number;
  totalScore5: number;
}

interface DFeedbackTableResponseType {
  tableBody: DFeedbackTableBodyResponseType[];
  tableFoot: DFeedbackTableFootResponseType;
}

export interface DFeedbackResponseType {
  restaurant: RestaurantSubInfoResponseType;
  dateStart: string;
  dateEnd: string;
  card: DFeedbackCardResponseType;
  chart: DFeedbackChartResponseType;
  table: DFeedbackTableResponseType;
}
