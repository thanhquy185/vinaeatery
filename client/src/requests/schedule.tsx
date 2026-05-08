import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { ScheduleType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Lịch làm (Schedule)
export const FindAllSchedule = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<ScheduleType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
    if (findType! === "employeeId") params.employeeId = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<ScheduleType[]>(
    `/api/${keys.schedules}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.schedules,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneSchedule = (
  id: string,
): Promise<AxiosResponse<ScheduleType, any>> => {
  return instance.post(
    `/api/${keys.schedules}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.schedules,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateSchedule = ({
  restaurantId,
  name,
  dateStart,
  dateEnd,
  note,
  status,
  scheduleEmployees,
  scheduleShifts,
}: ScheduleType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.schedules,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "schedule",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          name,
          dateStart,
          dateEnd,
          note,
          status,
          scheduleEmployees,
          scheduleShifts,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.post(`/api/${keys.schedules}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateSchedule = ({
  id,
  name,
  dateStart,
  dateEnd,
  note,
  scheduleEmployees,
  scheduleShifts,
}: ScheduleType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.schedules,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "schedule",
    new Blob(
      [
        JSON.stringify({
          name,
          dateStart,
          dateEnd,
          note,
          scheduleEmployees,
          scheduleShifts,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.schedules}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleLockSchedule = ({
  id,
  status,
}: ScheduleType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.schedules,
            fieldAction: "lock",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "schedule",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.schedules}/lock/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
