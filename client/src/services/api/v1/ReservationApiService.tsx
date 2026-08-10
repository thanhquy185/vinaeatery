import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  ReservationCreateRequestType,
  ReservationCrudResponseType,
  ReservationCustomerCreateRequestType,
  ReservationCustomerResponseType,
  ReservationDetailResponseType,
  ReservationSummaryResponseType,
  ReservationUpdateStatusRequestType,
} from "../../../types/ReservationType";

const FEATURE_NAME = "reservations";

const ReservationApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<ReservationDetailResponseType, any>
  > {
    return instance.get<ReservationDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleGetSummary({
    page,
    size,
    findType,
    findValue,
    arriveAtValue,
    statusValue,
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<ReservationSummaryResponseType>, any>
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
      if (findType === "customer-fullname") params.customerFullname = findValue;
      if (findType === "customer-phone") params.customerPhone = findValue;
      if (findType === "customer-email") params.customerEmail = findValue;
    }
    if (arriveAtValue! && arriveAtValue!.length > 0) {
      if (arriveAtValue![0] !== "") params.arriveAtStart = arriveAtValue![0];
      if (arriveAtValue![1] !== "") params.arriveAtEnd = arriveAtValue![1];
    }
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<ReservationSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetAllByCustomerId({
    page,
    size,
    findType,
    findValue,
    statusValue,
    restaurantId,
    customerId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<ReservationCustomerResponseType>, any>
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
      if (findType === "customer-fullname") params.customerFullname = findValue;
      if (findType === "customer-phone") params.customerPhone = findValue;
      if (findType === "customer-email") params.customerEmail = findValue;
    }
    if (statusValue!) params.status = statusValue! as unknown as string;
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);
    if (customerId && !isNaN(customerId))
      params.customerId = String(customerId);

    return instance.get<PageResponseType<ReservationCustomerResponseType>, any>(
      `/api/v1/${FEATURE_NAME}/customer`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<ReservationCrudResponseType[], any>
  > {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<ReservationCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      { params },
    );
  },

  async handleCreate({
    restaurantId,
    employeeId,
    customerId,
    createAt,
    arriveAt,
    customerFullname,
    customerPhone,
    customerEmail,
    customerGuests,
    customerNote,
    status,
  }: ReservationCreateRequestType): Promise<
    RestResponseType<ReservationDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        employeeId,
        customerId,
        createAt,
        arriveAt,
        customerFullname,
        customerPhone,
        customerEmail,
        customerGuests,
        customerNote,
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleCustomerCreate({
    restaurantId,
    customerId,
    createAt,
    arriveAt,
    customerFullname,
    customerPhone,
    customerEmail,
    customerGuests,
    customerNote,
    status,
  }: ReservationCustomerCreateRequestType): Promise<
    RestResponseType<ReservationDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}/customer`,
      {
        restaurantId,
        customerId,
        createAt,
        arriveAt,
        customerFullname,
        customerPhone,
        customerEmail,
        customerGuests,
        customerNote,
        status,
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
    employeeId,
    status,
  }: ReservationUpdateStatusRequestType): Promise<
    RestResponseType<ReservationDetailResponseType>
  > {
    return instance.patch(
      `/api/v1/${FEATURE_NAME}/${id}/status`,
      {
        employeeId,
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleCustomerUpdateStatus({
    id,
    employeeId,
    status,
  }: ReservationUpdateStatusRequestType): Promise<
    RestResponseType<ReservationDetailResponseType>
  > {
    return instance.patch(
      `/api/v1/${FEATURE_NAME}/customer/${id}/status`,
      {
        employeeId,
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

export default ReservationApiService;
