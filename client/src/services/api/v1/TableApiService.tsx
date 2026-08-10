import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  TableCreateRequestType,
  TableCrudResponseType,
  TableDeleteRequestType,
  TableDetailResponseType,
  TableSummaryResponseType,
  TableUpdateRequestType,
} from "../../../types/TableType";

const FEATURE_NAME = "tables";

const TableApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<TableDetailResponseType, any>> {
    return instance.get<TableDetailResponseType>(
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
    AxiosResponse<PageResponseType<TableSummaryResponseType>, any>
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

    return instance.get<PageResponseType<TableSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<AxiosResponse<TableCrudResponseType[], any>> {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<TableCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      {
        params,
      },
    );
  },

  async handleCreate({
    restaurantId,
    name,
    floorId,
    categoryTableId,
    seats,
    description,
    status,
  }: TableCreateRequestType): Promise<
    RestResponseType<TableDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        name,
        floorId,
        categoryTableId,
        seats,
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
    floorId,
    categoryTableId,
    seats,
    description,
  }: TableUpdateRequestType): Promise<
    RestResponseType<TableDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        name,
        floorId,
        categoryTableId,
        seats,
        description,
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
  }: TableDeleteRequestType): Promise<
    RestResponseType<TableDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default TableApiService;
