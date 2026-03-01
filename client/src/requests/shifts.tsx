import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { ShiftType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Ca làm (Shift)
export const FindAllShift = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<ShiftType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<ShiftType[]>(
    `/api/${keys.shifts}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.shifts,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneShift = (
  id: string,
): Promise<AxiosResponse<ShiftType, any>> => {
  return instance.post(
    `/api/${keys.shifts}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.shifts,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateShift = ({
  restaurantId,
  name,
  status,
  shiftDetails,
}: ShiftType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.shifts,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "shift",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          name,
          status,
          shiftDetails,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.post(`/api/${keys.shifts}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateShift = ({
  id,
  name,
  updateAt,
  shiftDetails,
}: ShiftType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.shifts,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "shift",
    new Blob(
      [
        JSON.stringify({
          name,
          updateAt,
          shiftDetails,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.shifts}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockShift = ({
  id,
  status,
  updateAt,
}: ShiftType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.shifts,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "shift",
    new Blob(
      [
        JSON.stringify({
          status,
          updateAt,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.shifts}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
