import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  BillCreateRequestType,
  BillCustomerResponseType,
  BillCustomerDetailResponseType,
  BillDetailResponseType,
  BillSummaryResponseType,
  BillUpdateStatusRequestType,
} from "../../../types/BillType";

const FEATURE_NAME = "bills";
type CustomerBillResponse =
  | PageResponseType<BillCustomerResponseType>
  | BillCustomerResponseType[];

const buildCustomerBillParams = ({
  page,
  size,
  sort,
  statusValue,
}: FilterDataProps): Record<string, string> => {
  const params: Record<string, string> = {};
  if (page && !isNaN(page)) params.page = String(page - 1);
  if (size && !isNaN(size)) params.size = String(size);
  if (sort) params.sort = sort;
  if (statusValue?.length) params.status = statusValue[0];
  return params;
};

const BillApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<BillDetailResponseType, any>> {
    return instance.get<BillDetailResponseType>(
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
    AxiosResponse<PageResponseType<BillSummaryResponseType>, any>
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
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<BillSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCurrentCustomerBills(
    filters: FilterDataProps,
  ): Promise<
    AxiosResponse<CustomerBillResponse, any>
  > {
    return instance.get<PageResponseType<BillCustomerResponseType>>(
      `/api/v1/${FEATURE_NAME}/customer/me`,
      { params: buildCustomerBillParams(filters) },
    );
  },

  async handleGetCurrentCustomerBillDetail({
    id,
  }: FilterDataProps): Promise<AxiosResponse<BillCustomerDetailResponseType, any>> {
    return instance.get<BillCustomerDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/customer/me/${id}`,
    );
  },

  async handleGetAllByCustomerId({
    customerId,
    ...filters
  }: {
    customerId: number;
  } & FilterDataProps): Promise<
    AxiosResponse<CustomerBillResponse, any>
  > {
    return instance.get<PageResponseType<BillCustomerResponseType>>(
      `/api/v1/${FEATURE_NAME}/customer/${customerId}`,
      { params: buildCustomerBillParams(filters) },
    );
  },

  async handleCreate({
    restaurantId,
    employeeId,
    customerId,
    createAt,
    customerFullname,
    customerPhone,
    customerEmail,
    totalPrice,
    status,
    paymentId,
    paymentMethodId,
    paymentAt,
    paymentTotalPrice,
    paymentStatus,
    billDetails,
  }: BillCreateRequestType): Promise<RestResponseType<BillDetailResponseType>> {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        employeeId,
        customerId,
        createAt,
        customerFullname,
        customerPhone,
        customerEmail,
        totalPrice,
        status,
        paymentId,
        paymentMethodId,
        paymentAt,
        paymentTotalPrice,
        paymentStatus,
        billDetails,
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
  }: BillUpdateStatusRequestType): Promise<
    RestResponseType<BillDetailResponseType>
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

export default BillApiService;
