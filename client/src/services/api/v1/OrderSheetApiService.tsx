import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  OrderSheetCreateRequestType,
  OrderSheetDetailResponseType,
  OrderSheetSummaryResponseType,
  OrderSheetUpdateStatusRequestType,
} from "../../../types/OrderSheetType";

const FEATURE_NAME = "order-sheets";

const OrderSheetApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<OrderSheetDetailResponseType, any>
  > {
    return instance.get<OrderSheetDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleGetSummary({
    page,
    size,
    findType,
    findValue,
    timeValue,
    floorValue,
    statusValue,
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<OrderSheetSummaryResponseType>, any>
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
      if (findType === "tableName") params.tableName = findValue;
    }
    if (timeValue && timeValue.length > 0) {
      if (timeValue[0]) params.createAtStart = timeValue[0];
      if (timeValue[1]) params.createAtEnd = timeValue[1];
    }
    if (floorValue && floorValue.length > 0) params.floorId = floorValue[0];
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<OrderSheetSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleCreate({
    restaurantId,
    useTableId,
    createAt,
    totalPrice,
    note,
    status,
    orderSheetDetails,
  }: OrderSheetCreateRequestType): Promise<
    RestResponseType<OrderSheetDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        useTableId,
        createAt,
        totalPrice,
        note,
        status,
        orderSheetDetails,
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
    serviceAt,
    cancelAt,
    message,
    status,
  }: OrderSheetUpdateStatusRequestType): Promise<
    RestResponseType<OrderSheetDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}/status`,
      {
        employeeId,
        serviceAt,
        cancelAt,
        message,
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

export default OrderSheetApiService;
