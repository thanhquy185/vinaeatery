import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { FoodType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Món ăn (Food)
export const FindAllFood = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<FoodType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryFoodId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<FoodType[]>(
    `/api/${keys.foods}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.foods, fieldAction: "read" }),
    {
      params,
    },
  );
};
export const FindOneFood = (
  id: string,
): Promise<AxiosResponse<FoodType, any>> => {
  return instance.post(
    `/api/${keys.foods}/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.foods, fieldAction: "read" }),
  );
};
export const HandleCreateFood = ({
  restaurantId,
  name,
  image,
  categoryFoodId,
  unit,
  price,
  description,
  status,
  recipe,
}: FoodType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.foods,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "food",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          name,
          categoryFoodId,
          unit,
          price,
          description,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );
  // Công thức món ăn
  if (recipe)
    formData.append(
      "recipe",
      new Blob([JSON.stringify(recipe)], { type: "application/json" }),
    );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.post(`/api/${keys.foods}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateFood = ({
  id,
  name,
  image,
  categoryFoodId,
  unit,
  price,
  description,
  recipe,
}: FoodType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.foods,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "food",
    new Blob(
      [
        JSON.stringify({
          name,
          categoryFoodId,
          unit,
          price,
          description,
        }),
      ],
      { type: "application/json" },
    ),
  );
  // Công thức món ăn
  if (recipe)
    formData.append(
      "recipe",
      new Blob([JSON.stringify(recipe)], { type: "application/json" }),
    );
  // Hình ảnh
  if (image) formData.append("image-file", image);

  return instance.put(`/api/${keys.foods}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockFood = ({
  id,
  status,
}: FoodType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.foods,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "food",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.foods}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
