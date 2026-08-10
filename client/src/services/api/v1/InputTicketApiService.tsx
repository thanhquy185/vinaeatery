import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  InputTicketCreateRequestType,
  InputTicketDetailResponseType,
  InputTicketSummaryResponseType,
  InputTicketUpdatePaymentStatusRequestType,
  InputTicketUpdateStatusRequestType,
} from "../../../types/InputTicketType";

const FEATURE_NAME = "input-tickets";

const InputTicketApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<InputTicketDetailResponseType, any>
  > {
    return instance.get<InputTicketDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleGetSummary({
    page,
    size,
    findType,
    findValue,
    statusValue,
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<InputTicketSummaryResponseType>, any>
  > {
    const params: Record<string, string> = {};
    if (page && !isNaN(page)) {
      params.page = String(page - 1);
    }
    if (size && !isNaN(size)) {
      params.size = String(size);
    }
    if (findValue && findType) {
      if (findType === "id") params.id = findValue;
      if (findType === "name") params.name = findValue;
    }
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<InputTicketSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleCreate({
    restaurantId,
    createAt,
    employeeId,
    supplierId,
    totalInputPrice,
    paymentStatus,
    status,
    inputTicketDetails,
  }: InputTicketCreateRequestType): Promise<
    RestResponseType<InputTicketDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        createAt,
        employeeId,
        supplierId,
        totalInputPrice,
        paymentStatus,
        status,
        inputTicketDetails,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleUpdatePaymentStatus({
    id,
    paymentStatus,
  }: InputTicketUpdatePaymentStatusRequestType): Promise<
    RestResponseType<InputTicketDetailResponseType>
  > {
    return instance.patch(
      `/api/v1/${FEATURE_NAME}/${id}/payment-status`,
      {
        paymentStatus,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleUpdateStatus({
    id,
    status,
  }: InputTicketUpdateStatusRequestType): Promise<
    RestResponseType<InputTicketDetailResponseType>
  > {
    return instance.patch(
      `/api/v1/${FEATURE_NAME}/${id}/status`,
      {
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};

export default InputTicketApiService;
