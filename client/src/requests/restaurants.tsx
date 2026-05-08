import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { RestaurantType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Nhà hàng (Restaurant)
export const FindAllRestaurant = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<RestaurantType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<RestaurantType[]>(
    `/api/${keys.restaurants}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.restaurants,
      fieldAction: "read",
    }),
  );
};
export const FindAllRestaurantByManagerId = ({
  managerId,
}: {
  managerId: number;
}): Promise<AxiosResponse<RestaurantType[], any>> => {
  // Tham số để lọc dữ liệu
  // const params: Record<string, string> = {};
  // if (findValue! !== "") {
  //   if (findType! === "table") params.tableName = findValue!;
  // }
  // if (timeValue! && timeValue!.length > 0) {
  //   if (timeValue![0] !== "") params.timeStart = timeValue![0];
  //   if (timeValue![1] !== "") params.timeEnd = timeValue![1];
  // }
  // if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  // if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<RestaurantType[]>(
    `/api/${keys.restaurants}/list-format-by-manager-id/${managerId}`,
    getNewFormSecurityValue({
      fieldName: keys.restaurants,
      fieldAction: "read",
    }),
  );
};
export const FindAllRestaurantForPublicPage = ({
  findType,
  findValue,
  statusValue,
}: FilterDataProps): Promise<AxiosResponse<RestaurantType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];

  return instance.post<RestaurantType[]>(
    `/api/${keys.restaurants}/list-format-for-public-page`,
    getNewFormSecurityValue({
      fieldName: keys.restaurants,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateRestaurant = ({
  managerId,
  createAt,
  restaurantImageFiles,
  name,
  phone,
  email,
  address,
  description,
  rating,
  status,
}: RestaurantType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.restaurants,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "restaurant",
    new Blob(
      [
        JSON.stringify({
          managerId,
          createAt,
          name,
          phone,
          email,
          address,
          description,
          rating,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );
  // Hình ảnh
  if (restaurantImageFiles) {
    restaurantImageFiles?.forEach((restaurantImageFile) =>
      formData.append("restaurant-images", restaurantImageFile),
    );
  }

  return instance.post(`/api/${keys.restaurants}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateRestaurant = ({
  id,
  managerId,
  restaurantImageFiles,
  name,
  phone,
  email,
  address,
  description,
  rating,
}: RestaurantType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.restaurants,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "restaurant",
    new Blob(
      [
        JSON.stringify({
          managerId,
          name,
          phone,
          email,
          address,
          description,
          rating,
        }),
      ],
      { type: "application/json" },
    ),
  );
  // Hình ảnh
  if (restaurantImageFiles) {
    restaurantImageFiles?.forEach((restaurantImageFile) =>
      formData.append("restaurant-images", restaurantImageFile),
    );
  }

  return instance.put(`/api/${keys.restaurants}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockRestaurant = ({
  id,
  status,
}: RestaurantType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.restaurants,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "restaurant",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.patch(`/api/${keys.restaurants}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
