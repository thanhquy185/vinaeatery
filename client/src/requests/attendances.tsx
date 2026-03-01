import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { AttendanceType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Điểm danh (Attendance)
export const FindAllAttendance = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<AttendanceType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<AttendanceType[]>(
    `/api/${keys.attendances}/list`,
    getNewFormSecurityValue({
      fieldName: keys.attendances,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindAllAttendanceFormat = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<AttendanceType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<AttendanceType[]>(
    `/api/${keys.attendances}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.attendances,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneAttendance = (
  id: string,
): Promise<AxiosResponse<AttendanceType, any>> => {
  return instance.post(
    `/api/Attendances/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.attendances,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateAttendance = ({
  restaurantId,
  employeeId,
  shiftId,
  date,
  checkIn,
  checkOut,
  leave,
  status,
}: AttendanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.attendances,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "attendance",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          employeeId,
          shiftId,
          date,
          checkIn,
          checkOut,
          leave,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.post(`/api/${keys.attendances}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateAttendance = ({
  id,
  checkIn,
  checkOut,
  leave,
  status,
}: AttendanceType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.attendances,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "attendance",
    new Blob(
      [
        JSON.stringify({
          checkIn,
          checkOut,
          leave,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.attendances}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
