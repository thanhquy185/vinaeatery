import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  RestaurantCreateRequestType,
  RestaurantCrudResponseType,
  RestaurantDeleteRequestType,
  RestaurantDetailResponseType,
  RestaurantManagerResponseType,
  RestaurantPublicDetailResponseType,
  RestaurantPublicResponseType,
  RestaurantSummaryResponseType,
  RestaurantUpdateRequestType,
} from "../../../types/RestaurantType";

const FEATURE_NAME = "restaurants";

const RestaurantApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<RestaurantDetailResponseType, any>
  > {
    return instance.get<RestaurantDetailResponseType>(
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
    AxiosResponse<PageResponseType<RestaurantSummaryResponseType>, any>
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
      if (findType === "phone") params.phone = findValue;
      if (findType === "email") params.email = findValue;
    }
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<RestaurantSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetPublicDetail({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<RestaurantPublicDetailResponseType, any>
  > {
    return instance.get<RestaurantPublicDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/public/${id}`,
    );
  },

  async handleGetPublic({
    page,
    size,
    findType,
    findValue,
    statusValue,
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<RestaurantPublicResponseType>, any>
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
      if (findType === "phone") params.phone = findValue;
      if (findType === "email") params.email = findValue;
    }
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<RestaurantPublicResponseType>>(
      `/api/v1/${FEATURE_NAME}/public`,
      { params },
    );
  },

  async handleGetAllByManagerId({
    managerId,
  }: FilterDataProps): Promise<
    AxiosResponse<RestaurantManagerResponseType[], any>
  > {
    return instance.get<RestaurantManagerResponseType[]>(
      `/api/v1/${FEATURE_NAME}/manager/${managerId}`,
    );
  },

  async handleGetCrud(): Promise<
    AxiosResponse<RestaurantCrudResponseType[], any>
  > {
    return instance.get<RestaurantCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
    );
  },

  async handleCreate({
    managerId,
    openAt,
    closeAt,
    name,
    phone,
    email,
    latitude,
    longitude,
    houseNumber,
    streetName,
    ward,
    province,
    description,
    status,
    images,
  }: RestaurantCreateRequestType): Promise<
    RestResponseType<RestaurantDetailResponseType>
  > {
    const formData = new FormData();
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            managerId,
            openAt,
            closeAt,
            name,
            phone,
            email,
            latitude,
            longitude,
            houseNumber,
            streetName,
            ward,
            province,
            description,
            status,
          }),
        ],
        { type: "application/json" },
      ),
    );
    if (images) {
      images?.forEach((image) => formData.append("image-files", image.image!));
    }

    return instance.post(`/api/v1/${FEATURE_NAME}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async handleUpdate({
    id,
    managerId,
    openAt,
    closeAt,
    name,
    phone,
    email,
    latitude,
    longitude,
    houseNumber,
    streetName,
    ward,
    province,
    description,
    images,
  }: RestaurantUpdateRequestType): Promise<
    RestResponseType<RestaurantDetailResponseType>
  > {
    const formData = new FormData();
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            managerId,
            openAt,
            closeAt,
            name,
            phone,
            email,
            latitude,
            longitude,
            houseNumber,
            streetName,
            ward,
            province,
            description,
          }),
        ],
        { type: "application/json" },
      ),
    );
    if (images) {
      images?.forEach((image) => formData.append("image-files", image.image!));
    }

    return instance.put(`/api/v1/${FEATURE_NAME}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async handleDelete({
    id,
    status,
  }: RestaurantDeleteRequestType): Promise<
    RestResponseType<RestaurantDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default RestaurantApiService;
