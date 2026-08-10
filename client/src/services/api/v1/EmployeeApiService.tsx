import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  EmployeeCreateRequestType,
  EmployeeDeleteRequestType,
  EmployeeDetailResponseType,
  EmployeeCrudResponseType,
  EmployeeUpdateRequestType,
  EmployeeSummaryResponseType,
} from "../../../types/EmployeeType";

const FEATURE_NAME = "employees";

const EmployeeApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<EmployeeDetailResponseType, any>> {
    return instance.get<EmployeeDetailResponseType>(
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
    AxiosResponse<PageResponseType<EmployeeSummaryResponseType>, any>
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

    return instance.get<PageResponseType<EmployeeSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleGetCrud({
    restaurantId,
  }: FilterDataProps): Promise<AxiosResponse<EmployeeCrudResponseType[], any>> {
    const params: Record<string, string> = {};
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<EmployeeCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
      {
        params,
      },
    );
  },

  async handleCreate({
    restaurantId,
    roleId,
    permissionId,
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
  }: EmployeeCreateRequestType): Promise<
    RestResponseType<EmployeeDetailResponseType>
  > {
    const formData = new FormData();
    formData.append("image-file", image!);
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            restaurantId,
            roleId,
            permissionId,
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
    roleId,
    permissionId,
    image,
    fullname,
    birthdate,
    gender,
    phone,
    email,
    houseNumber,
    streetName,
    ward,
    description,
    province,
  }: EmployeeUpdateRequestType): Promise<
    RestResponseType<EmployeeDetailResponseType>
  > {
    const formData = new FormData();
    formData.append("image-file", image!);
    formData.append(
      FEATURE_NAME.slice(0, FEATURE_NAME.length - 1),
      new Blob(
        [
          JSON.stringify({
            roleId,
            permissionId,
            fullname,
            birthdate,
            gender,
            phone,
            email,
            houseNumber,
            streetName,
            ward,
            description,
            province,
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
  }: EmployeeDeleteRequestType): Promise<
    RestResponseType<EmployeeDetailResponseType>
  > {
    return instance.delete(`/api/v1/${FEATURE_NAME}/${id}`, {
      data: {
        status,
      },
    });
  },
};

export default EmployeeApiService;
