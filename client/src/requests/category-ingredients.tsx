import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { CategoryIngredientType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Loại nguyên liệu (Category Ingredient)
export const FindAllCategoryIngredient = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<CategoryIngredientType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryIngredientType[]>(
    `/api/${keys.categoryIngredients}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneCategoryIngredient = (
  id: string
): Promise<AxiosResponse<CategoryIngredientType, any>> => {
  return instance.post(
    `/api/${keys.categoryIngredients}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "read",
    })
  );
};
export const HandleCreateCategoryIngredient = ({
  restaurantId,
  name,
  description,
  status,
}: CategoryIngredientType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "create",
    }),
    categoryIngredient: {
      restaurantId,
      name,
      description,
      status,
    },
  };

  return instance.post(`/api/${keys.categoryIngredients}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateCategoryIngredient = ({
  id,
  name,
  description,
}: CategoryIngredientType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "update",
    }),
    categoryIngredient: {
      name,
      description,
    },
  };

  return instance.put(
    `/api/${keys.categoryIngredients}/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export const HandleLockCategoryIngredient = ({
  id,
  status,
}: CategoryIngredientType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryIngredients,
      fieldAction: "lock",
    }),
    categoryIngredient: {
      status,
    },
  };

  return instance.patch(
    `/api/${keys.categoryIngredients}/lock/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
