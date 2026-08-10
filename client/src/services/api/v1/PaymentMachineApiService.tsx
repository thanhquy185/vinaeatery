import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  PaymentMachineCreateRequestType,
  PaymentMachineDetailResponseType,
  PaymentMachineUpdateRequestType,
} from "../../../types/PaymentMachineType";

const FEATURE_NAME = "payment-machines";

const PaymentMachineApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<PaymentMachineDetailResponseType, any>
  > {
    return instance.get<PaymentMachineDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleCreate({
    restaurantId,
    useTableId,
    employeeId,
    at,
    processStatus,
    status,
  }: PaymentMachineCreateRequestType): Promise<
    RestResponseType<PaymentMachineDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        useTableId,
        at,
        employeeId,
        processStatus,
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleUpdate({
    id,
    paymentMethodId,
    paymentTotalPrice,
    processStatus,
    status,
    feedbackExperience,
    feedbackScore1,
    feedbackScore2,
    feedbackScore3,
    feedbackScore4,
    feedbackScore5,
    feedbackMessage,
  }: PaymentMachineUpdateRequestType): Promise<
    RestResponseType<PaymentMachineDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        paymentMethodId,
        paymentTotalPrice,
        processStatus,
        status,
        feedbackExperience,
        feedbackScore1,
        feedbackScore2,
        feedbackScore3,
        feedbackScore4,
        feedbackScore5,
        feedbackMessage,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};

export default PaymentMachineApiService;
