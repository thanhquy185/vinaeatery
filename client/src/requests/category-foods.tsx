import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { CategoryFoodType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Loại món ăn (Category Food)
export const FindAllCategoryFood = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<CategoryFoodType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryFoodType[]>(
    `/api/${keys.categoryFoods}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryFoods,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneCategoryFood = (
  id: string,
): Promise<AxiosResponse<CategoryFoodType, any>> => {
  return instance.post(
    `/api/${keys.categoryFoods}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryFoods,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateCategoryFood = ({
  restaurantId,
  name,
  image,
  description,
  status,
}: CategoryFoodType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.categoryFoods,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "category-food",
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
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.categoryFoods}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateCategoryFood = ({
  id,
  name,
  image,
  description,
  // updateAt,
}: CategoryFoodType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.categoryFoods,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "category-food",
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
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.categoryFoods}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockCategoryFood = ({
  id,
  status,
}: CategoryFoodType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.categoryFoods,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "category-food",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.categoryFoods}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
