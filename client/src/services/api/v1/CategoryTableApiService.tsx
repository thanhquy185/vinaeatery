import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  CategoryTableCreateRequestType,
  CategoryTableDeleteRequestType,
  CategoryTableCrudResponseType,
  CategoryTableUpdateRequestType,
  CategoryTableSummaryResponseType,
  CategoryTableDetailResponseType,
} from "../../../types/CategoryTableType";

const FEATURE_NAME = "category-tables";

const CategoryTableApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<CategoryTableDetailResponseType, any>
  > {
    return instance.get<CategoryTableDetailResponseType>(
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
    AxiosResponse<PageResponseType<CategoryTableSummaryResponseType>, any>
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

    return instance.get<PageResponseType<CategoryTableSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<CategoryTableCrudResponseType[], any>
  > {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<CategoryTableCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      { params },
    );
  },

  async handleCreate({
    restaurantId,
    name,
    surchargeType,
    surchargeValue,
    description,
    status,
  }: CategoryTableCreateRequestType): Promise<
    RestResponseType<CategoryTableDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        name,
        surchargeType,
        surchargeValue,
        description,
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
    name,
    surchargeType,
    surchargeValue,
    description,
  }: CategoryTableUpdateRequestType): Promise<
    RestResponseType<CategoryTableDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      { name, surchargeType, surchargeValue, description },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleDelete({
    id,
    status,
  }: CategoryTableDeleteRequestType): Promise<
    RestResponseType<CategoryTableDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default CategoryTableApiService;
