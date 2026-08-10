import type { MessageDetailCreateRequestType } from "./MessageDetailType";

export interface OpenPaymentMachineRequestType {
  paymentMachineId: number;
  tableName: string;
}

export interface RestaurantReadMessageRequestType {
  messageId: number;
}

export interface RestaurantSendMessageRequestType {
  messageId: number;
  messageDetail: MessageDetailCreateRequestType;
}

export interface CustomerSendMessageRequestType {
  restaurantId: number;
  useTableId: number;
  messageDetail: MessageDetailCreateRequestType;
}

export interface UpdateStatusOrderSheetRequestType {
  orderSheetId: number;
}
