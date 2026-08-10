import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  IngredientCreateRequestType,
  IngredientCrudResponseType,
  IngredientDeleteRequestType,
  IngredientDetailResponseType,
  IngredientSummaryResponseType,
  IngredientUpdateRequestType,
} from "../../../types/IngredientType";

const FEATURE_NAME = "ingredients";

const IngredientApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<IngredientDetailResponseType, any>
  > {
    return instance.get<IngredientDetailResponseType>(
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
    AxiosResponse<PageResponseType<IngredientSummaryResponseType>, any>
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

    return instance.get<PageResponseType<IngredientSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<IngredientCrudResponseType[], any>
  > {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<IngredientCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      {
        params,
      },
    );
  },

  async handleCreate({
    restaurantId,
    name,
    categoryIngredientId,
    unit,
    capacity,
    dateCreate,
    dateRemove,
    inputPrice,
    inventory,
    note,
    status,
  }: IngredientCreateRequestType): Promise<
    RestResponseType<IngredientDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        name,
        categoryIngredientId,
        unit,
        capacity,
        dateCreate,
        dateRemove,
        inputPrice,
        inventory,
        note,
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
    categoryIngredientId,
    unit,
    capacity,
    dateCreate,
    dateRemove,
    inputPrice,
    inventory,
    note,
  }: IngredientUpdateRequestType): Promise<
    RestResponseType<IngredientDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        name,
        categoryIngredientId,
        unit,
        capacity,
        dateCreate,
        dateRemove,
        inputPrice,
        inventory,
        note,
      },
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
  }: IngredientDeleteRequestType): Promise<
    RestResponseType<IngredientDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default IngredientApiService;
