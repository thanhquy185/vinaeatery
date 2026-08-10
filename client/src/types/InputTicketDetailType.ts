import type { InputTicketEntityType } from "./InputTicketType";
import type {
  IngredientEntityType,
  IngredientInfoResponseType,
} from "./IngredientType";

interface InputTicketDetailIdEntityType {
  inputTicketId: number;
  ingredientId: number;
}

export interface InputTicketDetailEntityType {
  id: InputTicketDetailIdEntityType;
  inputTicket: InputTicketEntityType;
  ingredient: IngredientEntityType;
  quantity: number;
  inputPrice: number;
  ingredientNameSnapshot: string;
  ingredientInputPriceSnapshot: number;
  totalInputPriceDetail: number;
}

export interface InputTicketDDetailResponseType {
  ingredient: IngredientInfoResponseType;
  quantity: number;
  inputPrice: number;
  ingredientNameSnapshot: string;
  ingredientInputPriceSnapshot: number;
  totalInputPriceDetail: number;
}

export interface InputTicketDetailCreateRequestType {
  ingredientId: number;
  quantity: number;
  inputPrice: number;
  ingredientNameSnapshot: string;
  ingredientInputPriceSnapshot: number;
  totalInputPriceDetail: number;
}
