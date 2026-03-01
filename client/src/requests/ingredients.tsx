import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { IngredientType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Nguyên liệu (Ingredient)
export const FindAllIngredient = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<IngredientType[], any>> => {
  // Tham số đẻ lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryIngredientId = categoryValue!.join(",");
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<IngredientType[]>(
    `/api/${keys.ingredients}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneIngredient = (
  id: string
): Promise<AxiosResponse<IngredientType, any>> => {
  return instance.post(
    `/api/${keys.ingredients}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "read",
    })
  );
};
export const HandleCreateIngredient = ({
  restaurantId,
  name,
  categoryIngredientId,
  unit,
  capacity,
  dateCreate,
  dateRemove,
  inputPrice,
  inventory,
  note,
  status,
}: IngredientType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "create",
    }),
    ingredient: {
      restaurantId,
      name,
      categoryIngredientId,
      unit,
      capacity,
      dateCreate,
      dateRemove,
      inputPrice,
      inventory,
      note,
      status,
    },
  };

  return instance.post(`/api/${keys.ingredients}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateIngredient = ({
  id,
  name,
  categoryIngredientId,
  unit,
  capacity,
  dateCreate,
  dateRemove,
  inputPrice,
  note,
  updateAt,
}: IngredientType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "update",
    }),
    ingredient: {
      name,
      categoryIngredientId,
      unit,
      capacity,
      dateCreate,
      dateRemove,
      inputPrice,
      note,
      updateAt,
    },
  };

  return instance.put(`/api/${keys.ingredients}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleLockIngredient = ({
  id,
  status,
}: IngredientType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.ingredients,
      fieldAction: "lock",
    }),
    ingredient: {
      status,
    },
  };

  return instance.patch(`/api/${keys.ingredients}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
