import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  UseFoodDetailResponseType,
  UseFoodSummaryResponseType,
  UseFoodUpdateStatusRequestType,
} from "../../../types/UseFoodType";

const FEATURE_NAME = "use-foods";

const UseFoodApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<UseFoodDetailResponseType, any>> {
    return instance.get<UseFoodDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleGetSummary({
    page,
    size,
    findType,
    findValue,
    timeValue,
    categoryValue,
    statusValue,
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<UseFoodSummaryResponseType>, any>
  > {
    const params: Record<string, string> = {};
    params.sort = "food_id_asc";
    if (page && !isNaN(page)) {
      params.page = String(page - 1);
    }
    if (size && !isNaN(size)) {
      params.size = String(size);
    }
    if (findValue && findType) {
      if (findType === "foodName") params.foodName = findValue;
    }
    if (timeValue && timeValue.length > 0) {
      if (timeValue[0]) params.endAtStart = timeValue[0];
      if (timeValue[1]) params.endAtEnd = timeValue[1];
    }
    if (categoryValue! && categoryValue!.length > 0)
      params.categoryFoodId = categoryValue![0];
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<UseFoodSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleUpdateStatus({
    id,
    employeeId,
    endAt,
    status,
  }: UseFoodUpdateStatusRequestType): Promise<
    RestResponseType<UseFoodDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        employeeId,
        endAt,
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

export default UseFoodApiService;
