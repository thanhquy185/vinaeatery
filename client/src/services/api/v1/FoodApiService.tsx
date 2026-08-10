import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  FoodCreateRequestType,
  FoodCrudResponseType,
  FoodDeleteRequestType,
  FoodDetailResponseType,
  FoodSummaryResponseType,
  FoodUpdateRequestType,
} from "../../../types/FoodType";

const FEATURE_NAME = "foods";

const FoodApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<FoodDetailResponseType, any>> {
    return instance.get<FoodDetailResponseType>(
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
    AxiosResponse<PageResponseType<FoodSummaryResponseType>, any>
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

    return instance.get<PageResponseType<FoodSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<AxiosResponse<FoodCrudResponseType[], any>> {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<FoodCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      {
        params,
      },
    );
  },

  async handleCreate({
    restaurantId,
    image,
    name,
    categoryFoodId,
    unit,
    price,
    description,
    status,
    recipes,
  }: FoodCreateRequestType): Promise<RestResponseType<FoodDetailResponseType>> {
    const formData = new FormData();
    formData.append("image-file", image!);
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            restaurantId,
            name,
            categoryFoodId,
            unit,
            price,
            description,
            status,
            recipes,
          }),
        ],
        { type: "application/json" },
      ),
    );

    return instance.post(`/api/v1/${FEATURE_NAME}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async handleUpdate({
    id,
    image,
    name,
    categoryFoodId,
    unit,
    price,
    description,
    recipes,
  }: FoodUpdateRequestType): Promise<RestResponseType<FoodDetailResponseType>> {
    const formData = new FormData();
    formData.append("image-file", image!);
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            name,
            categoryFoodId,
            unit,
            price,
            description,
            recipes,
          }),
        ],
        { type: "application/json" },
      ),
    );

    return instance.put(`/api/v1/${FEATURE_NAME}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async handleDelete({
    id,
    status,
  }: FoodDeleteRequestType): Promise<RestResponseType<FoodDetailResponseType>> {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default FoodApiService;
