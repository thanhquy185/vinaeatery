import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type {
  CategoryFoodCreateRequestType,
  CategoryFoodCrudResponseType,
  CategoryFoodDeleteRequestType,
  CategoryFoodDetailResponseType,
  CategoryFoodSummaryResponseType,
  CategoryFoodUpdateRequestType,
} from "../../../types/CategoryFoodType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type { PageResponseType } from "../../../types/PageResponseType";

const FEATURE_NAME = "category-foods";

const CategoryFoodApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<CategoryFoodDetailResponseType, any>
  > {
    return instance.get<CategoryFoodDetailResponseType>(
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
    AxiosResponse<PageResponseType<CategoryFoodSummaryResponseType>, any>
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

    return instance.get<PageResponseType<CategoryFoodSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<CategoryFoodCrudResponseType[], any>
  > {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<CategoryFoodCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      { params },
    );
  },

  async handleCreate({
    restaurantId,
    image,
    name,
    description,
    status,
  }: CategoryFoodCreateRequestType): Promise<
    RestResponseType<CategoryFoodDetailResponseType>
  > {
    const formData = new FormData();
    formData.append("image-file", image!);
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            restaurantId,
            name,
            description,
            status,
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
    description,
  }: CategoryFoodUpdateRequestType): Promise<
    RestResponseType<CategoryFoodDetailResponseType>
  > {
    const formData = new FormData();
    formData.append("image-file", image!);
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            name,
            description,
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
  }: CategoryFoodDeleteRequestType): Promise<
    RestResponseType<CategoryFoodDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default CategoryFoodApiService;
