import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  UseTableEntityType,
  UseTableInfoResponseType,
} from "./UseTableType";
import type {
  MessageDDetailResponseType,
  MessageDetailCreateRequestType,
  MessageDetailEntityType,
} from "./MessageDetailType";

export interface MessageEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  useTable: UseTableEntityType;
  createAt: string;
  isRead: boolean;
  messageDetails: MessageDetailEntityType[];
}

export interface MessageDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  useTable: UseTableInfoResponseType;
  createAt: string;
  isRead: boolean;
  messageDetails: MessageDDetailResponseType[];
}

export interface MessageSummaryResponseType {
  id: number;
  useTable: UseTableInfoResponseType;
  createAt: string;
  isRead: boolean;
  messageDetails: MessageDDetailResponseType[];
}

export interface MessageInfoResponseType {
  id: number;
  createAt: string;
  isRead: boolean;
  messageDetails: MessageDDetailResponseType[];
}

export interface MessageCreateRequestType {
  restaurantId: number;
  useTableId: number;
  createAt: string;
  isRead: boolean;
  messageDetails: MessageDetailCreateRequestType[];
}
