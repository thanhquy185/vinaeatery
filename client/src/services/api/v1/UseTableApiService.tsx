import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  UseTableCustomerResponseType,
  UseTableDetailResponseType,
  UseTableSummaryResponseType,
  UseTableUpdateStatusRequestType,
} from "../../../types/UseTableType";

const FEATURE_NAME = "use-tables";

const UseTableApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<UseTableDetailResponseType, any>> {
    return instance.get<UseTableDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleGetCustomerByRestaurantIdAndTableId({
    restaurantId,
    tableId,
  }: FilterDataProps): Promise<
    AxiosResponse<UseTableCustomerResponseType, any>
  > {
    return instance.get<UseTableCustomerResponseType>(
      `/api/v1/${FEATURE_NAME}/restaurant/${restaurantId}/table/${tableId}`,
    );
  },

  async handleGetSummary({
    page,
    size,
    sort,
    findType,
    findValue,
    timeValue,
    floorValue,
    statusValue,
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<UseTableSummaryResponseType>, any>
  > {
    const params: Record<string, string> = {};
    if (page && !isNaN(page)) {
      params.page = String(page - 1);
    }
    if (size && !isNaN(size)) {
      params.size = String(size);
    }
    if (sort) {
      params.sort = sort;
    }
    if (findValue && findType) {
      if (findType === "id") params.id = findValue;
    }
    if (timeValue && timeValue.length > 0) {
      if (timeValue[0]) params.endAtStart = timeValue[0];
      if (timeValue[1]) params.endAtEnd = timeValue[1];
    }
    if (floorValue && floorValue.length > 0) params.floorId = floorValue[0];
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<UseTableSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleUpdateStatus({
    id,
    menuId,
    reservationId,
    employeeId,
    customerId,
    endAt,
    customerFullname,
    customerPhone,
    customerEmail,
    customerAdult,
    customerChild,
    customerGuests,
    status,
  }: UseTableUpdateStatusRequestType): Promise<
    RestResponseType<UseTableDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        menuId,
        reservationId,
        employeeId,
        customerId,
        endAt,
        customerFullname,
        customerPhone,
        customerEmail,
        customerAdult,
        customerChild,
        customerGuests,
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

export default UseTableApiService;
