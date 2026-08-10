import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type {
  SupplierCreateRequestType,
  SupplierCrudResponseType,
  SupplierDeleteRequestType,
  SupplierDetailResponseType,
  SupplierSummaryResponseType,
  SupplierUpdateRequestType,
} from "../../../types/SupplierType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type { PageResponseType } from "../../../types/PageResponseType";

const FEATURE_NAME = "suppliers";

const SupplierApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<SupplierDetailResponseType, any>> {
    return instance.get<SupplierDetailResponseType>(
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
    AxiosResponse<PageResponseType<SupplierSummaryResponseType>, any>
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
      if (findType === "fullname") params.fullname = findValue;
      if (findType === "phone") params.phone = findValue;
      if (findType === "email") params.email = findValue;
    }
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<SupplierSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<AxiosResponse<SupplierCrudResponseType[], any>> {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<SupplierCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      {
        params,
      },
    );
  },

  async handleCreate({
    restaurantId,
    fullname,
    phone,
    email,
    houseNumber,
    streetName,
    ward,
    province,
    status,
  }: SupplierCreateRequestType): Promise<
    RestResponseType<SupplierDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        fullname,
        phone,
        email,
        houseNumber,
        streetName,
        ward,
        province,
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
    fullname,
    phone,
    email,
    houseNumber,
    streetName,
    ward,
    province,
  }: SupplierUpdateRequestType): Promise<
    RestResponseType<SupplierDetailResponseType>
  > {
    return instance.put(
      `/api/v1/${FEATURE_NAME}/${id}`,
      {
        fullname,
        phone,
        email,
        houseNumber,
        streetName,
        ward,
        province,
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
  }: SupplierDeleteRequestType): Promise<
    RestResponseType<SupplierDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default SupplierApiService;
