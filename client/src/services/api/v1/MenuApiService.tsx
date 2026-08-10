import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  MenuCreateRequestType,
  MenuDeleteRequestType,
  MenuUpdateRequestType,
  MenuDetailResponseType,
  MenuSummaryResponseType,
} from "../../../types/MenuType";

const FEATURE_NAME = "menus";

const MenuApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<MenuDetailResponseType, any>> {
    return instance.get<MenuDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleGetSummary({
    page,
    size,
    findType,
    findValue,
    categoryValue,
    statusValue,
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<MenuSummaryResponseType>, any>
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
    if (categoryValue! && categoryValue!.length > 0)
      params.type = categoryValue![0];
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<MenuSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleCreate({
    restaurantId,
    name,
    type,
    price,
    description,
    status,
    menuDetails,
  }: MenuCreateRequestType): Promise<RestResponseType<MenuDetailResponseType>> {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        name,
        type,
        price,
        description,
        status,
        menuDetails,
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
    type,
    price,
    description,
    menuDetails,
  }: MenuUpdateRequestType): Promise<RestResponseType<MenuDetailResponseType>> {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        name,
        type,
        price,
        description,
        menuDetails,
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
  }: MenuDeleteRequestType): Promise<RestResponseType<MenuDetailResponseType>> {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default MenuApiService;
