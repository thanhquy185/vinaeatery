import type {
  FeedbackExperienceEnum,
  PaymentMachineProcessStatusEnum,
  PaymentMachineStatusEnum,
} from "../constants/enums";
import type {
  RestaurantEntityType,
  RestaurantSubInfoResponseType,
} from "./RestaurantType";
import type {
  PaymentMethodEntityType,
  PaymentMethodInfoResponseType,
} from "./PaymentMethodType";
import type {
  EmployeeEntityType,
  EmployeeSubInfoResponseType,
} from "./EmployeeType";
import type {
  PaymentMachineFoodDetailResponseType,
  PaymentMachineFoodEntityType,
} from "./PaymentMachineFoodType";
import type { UseTableInfoResponseType } from "./UseTableType";

export interface PaymentMachineEntityType {
  id: number;
  restaurant: RestaurantEntityType;
  paymentMethod: PaymentMethodEntityType;
  employee: EmployeeEntityType;
  at: string;
  foodPrice: number;
  categoryTableSurcharge: number;
  customerDiscount: number;
  totalPrice: number;
  paymentId: string;
  paymentTotalPrice: number;
  processStatus: PaymentMachineProcessStatusEnum;
  status: PaymentMachineStatusEnum;
  paymentMachineFoods: PaymentMachineFoodEntityType[];
}

export interface PaymentMachineDetailResponseType {
  id: number;
  restaurant: RestaurantSubInfoResponseType;
  useTable: UseTableInfoResponseType;
  paymentMethod: PaymentMethodInfoResponseType;
  employee: EmployeeSubInfoResponseType;
  at: string;
  foodPrice: number;
  categoryTableSurcharge: number;
  customerDiscount: number;
  totalPrice: number;
  paymentId: string;
  paymentTotalPrice: number;
  processStatus: PaymentMachineProcessStatusEnum;
  status: PaymentMachineStatusEnum;
  paymentMachineFoods: PaymentMachineFoodDetailResponseType[];
}

export interface PaymentMachineInfoResponseType {
  id: number;
  paymentMethod: PaymentMethodInfoResponseType;
  employee: EmployeeSubInfoResponseType;
  at: string;
  foodPrice: number;
  categoryTableSurcharge: number;
  customerDiscount: number;
  totalPrice: number;
  paymentId: string;
  paymentTotalPrice: number;
  processStatus: PaymentMachineProcessStatusEnum;
  status: PaymentMachineStatusEnum;
  paymentMachineFoods: PaymentMachineFoodDetailResponseType[];
}

export interface PaymentMachineCreateRequestType {
  restaurantId: number;
  useTableId: number;
  employeeId: number;
  at: string;
  processStatus: PaymentMachineProcessStatusEnum;
  status: PaymentMachineStatusEnum;
}

export interface PaymentMachineUpdateRequestType {
  id: number;
  paymentMethodId: number | undefined;
  paymentTotalPrice: number | undefined;
  processStatus: PaymentMachineProcessStatusEnum;
  status: PaymentMachineStatusEnum;
  feedbackExperience: FeedbackExperienceEnum | undefined;
  feedbackScore1: number | undefined;
  feedbackScore2: number | undefined;
  feedbackScore3: number | undefined;
  feedbackScore4: number | undefined;
  feedbackScore5: number | undefined;
  feedbackMessage: string | undefined;
}
