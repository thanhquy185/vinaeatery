import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { UseFoodType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Sử dụng món ăn (Use Food)
export const FindAllUseFood = ({
  findType,
  findValue,
  timeValue,
  categoryValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<UseFoodType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "food") params.foodName = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.timeStart = timeValue![0];
    if (timeValue![1] !== "") params.timeEnd = timeValue![1];
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryFoodId = categoryValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<UseFoodType[]>(
    `/api/${keys.useFoods}/list-format`,
    getNewFormSecurityValue({ fieldName: keys.useFoods, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const FindAllUseFoodTimeEndIsNull = ({
  findType,
  findValue,
  categoryValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<UseFoodType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "food") params.foodName = findValue!;
  }
  if (categoryValue! && categoryValue!.length > 0)
    params.categoryFoodId = categoryValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<UseFoodType[]>(
    `/api/${keys.useFoods}/list-format?timeEnd=null`,
    getNewFormSecurityValue({ fieldName: keys.useFoods, fieldAction: "read" }),
    {
      params,
    }
  );
};
export const HandleUpdateUseFood = ({
  id,
  timeEnd,
  employeeId,
  status,
}: UseFoodType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.useFoods,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "use-food",
    new Blob(
      [
        JSON.stringify({
          timeEnd,
          employeeId,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.useFoods}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
