import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  UserChangePasswordRequestType,
  UserCreateRequestType,
  UserDeleteRequestType,
  UserDetailResponseType,
  UserSummaryResponseType,
} from "../../../types/UserType";

const FEATURE_NAME = "users";

const UserApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<UserDetailResponseType, any>> {
    return instance.get<UserDetailResponseType>(
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
    AxiosResponse<PageResponseType<UserSummaryResponseType>, any>
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
      if (findType === "username") params.username = findValue;
    }
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<UserSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleCreate({
    role,
    username,
    password,
    method,
    status,
  }: UserCreateRequestType): Promise<RestResponseType<UserDetailResponseType>> {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        role,
        method,
        username,
        password,
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async handleChangePassword({
    id,
    newPassword,
    newPassword2,
  }: UserChangePasswordRequestType): Promise<
    RestResponseType<UserDetailResponseType>
  > {
    return instance.patch(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        newPassword,
        newPassword2,
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
  }: UserDeleteRequestType): Promise<RestResponseType<UserDetailResponseType>> {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default UserApiService;
