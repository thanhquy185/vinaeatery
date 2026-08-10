import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  CategoryIngredientCreateRequestType,
  CategoryIngredientCrudResponseType,
  CategoryIngredientDeleteRequestType,
  CategoryIngredientDetailResponseType,
  CategoryIngredientSummaryResponseType,
  CategoryIngredientUpdateRequestType,
} from "../../../types/CategoryIngredientType";

const FEATURE_NAME = "category-ingredients";

const CategoryIngredientApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<CategoryIngredientDetailResponseType, any>
  > {
    return instance.get<CategoryIngredientDetailResponseType>(
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
    AxiosResponse<PageResponseType<CategoryIngredientSummaryResponseType>, any>
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

    return instance.get<
      PageResponseType<CategoryIngredientSummaryResponseType>
    >(`/api/v1/${FEATURE_NAME}`, { params });
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<CategoryIngredientCrudResponseType[], any>
  > {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<CategoryIngredientCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      { params },
    );
  },

  async handleCreate({
    restaurantId,
    name,
    description,
    status,
  }: CategoryIngredientCreateRequestType): Promise<
    RestResponseType<CategoryIngredientDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        name,
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
    description,
  }: CategoryIngredientUpdateRequestType): Promise<
    RestResponseType<CategoryIngredientDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      { name, description },
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
  }: CategoryIngredientDeleteRequestType): Promise<
    RestResponseType<CategoryIngredientDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default CategoryIngredientApiService;
