interface MessageDetailIdEntityType {
  messageId: number;
  sendAt: string;
  isRestaurantSend: boolean;
}

export interface MessageDetailEntityType {
  id: MessageDetailIdEntityType;
  content: string;
}

export interface MessageDDetailResponseType {
  sendAt: string;
  isRestaurantSend: boolean;
  content: string;
}

export interface MessageDetailCreateRequestType {
  sendAt: string;
  isRestaurantSend: boolean;
  content: string;
}
