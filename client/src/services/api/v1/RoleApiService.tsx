import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  RoleCreateRequestType,
  RoleDeleteRequestType,
  RoleDetailResponseType,
  RoleCrudResponseType,
  RoleUpdateRequestType,
  RoleSummaryResponseType,
} from "../../../types/RoleType";

const FEATURE_NAME = "roles";

const RoleApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<RoleDetailResponseType, any>> {
    return instance.get<RoleDetailResponseType>(
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
    AxiosResponse<PageResponseType<RoleSummaryResponseType>, any>
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

    return instance.get<PageResponseType<RoleSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<AxiosResponse<RoleCrudResponseType[], any>> {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<RoleCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      {
        params,
      },
    );
  },

  async handleCreate({
    restaurantId,
    name,
    salaryType,
    salaryValue,
    status,
  }: RoleCreateRequestType): Promise<RestResponseType<RoleDetailResponseType>> {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        name,
        salaryType,
        salaryValue,
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
    salaryType,
    salaryValue,
  }: RoleUpdateRequestType): Promise<RestResponseType<RoleDetailResponseType>> {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        name,
        salaryType,
        salaryValue,
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
  }: RoleDeleteRequestType): Promise<RestResponseType<RoleDetailResponseType>> {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default RoleApiService;
