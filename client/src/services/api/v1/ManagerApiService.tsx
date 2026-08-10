import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  ManagerCreateRequestType,
  ManagerCrudResponseType,
  ManagerDeleteRequestType,
  ManagerDetailResponseType,
  ManagerSummaryResponseType,
  ManagerUpdateRequestType,
} from "../../../types/ManagerType";

const FEATURE_NAME = "managers";

const ManagerApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<ManagerDetailResponseType, any>> {
    return instance.get<ManagerDetailResponseType>(
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
    AxiosResponse<PageResponseType<ManagerSummaryResponseType>, any>
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
      if (findType === "username") params.username = findValue;
      if (findType === "phone") params.phone = findValue;
      if (findType === "email") params.email = findValue;
    }
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<ManagerSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud(): Promise<
    AxiosResponse<ManagerCrudResponseType[], any>
  > {
    return instance.get<ManagerCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
    );
  },

  async handleCreate({
    image,
    fullname,
    birthdate,
    gender,
    phone,
    email,
    houseNumber,
    streetName,
    ward,
    province,
    description,
    status,
    userUsername,
    userPassword,
  }: ManagerCreateRequestType): Promise<
    RestResponseType<ManagerDetailResponseType>
  > {
    const formData = new FormData();
    formData.append("image-file", image!);
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            fullname,
            birthdate,
            gender,
            phone,
            email,
            houseNumber,
            streetName,
            ward,
            province,
            description,
            status,
            userUsername,
            userPassword,
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
    fullname,
    birthdate,
    gender,
    phone,
    email,
    houseNumber,
    streetName,
    ward,
    province,
    description,
  }: ManagerUpdateRequestType): Promise<
    RestResponseType<ManagerDetailResponseType>
  > {
    const formData = new FormData();
    formData.append("image-file", image!);
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            fullname,
            birthdate,
            gender,
            phone,
            email,
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

    return instance.put(`/api/v1/${FEATURE_NAME}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async handleDelete({
    id,
    status,
  }: ManagerDeleteRequestType): Promise<
    RestResponseType<ManagerDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default ManagerApiService;
