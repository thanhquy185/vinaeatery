import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { PermissionTicketType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Đơn xin phép (Permission Ticket)
export const FindAllPermissionTicket = ({
  findType,
  findValue,
  timeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<PermissionTicketType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "employeeMainId") params.employeeMainId = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.createAtStart = timeValue![0];
    if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<PermissionTicketType[]>(
    `/api/${keys.permissionTickets}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.permissionTickets,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOnePermissionTicket = (
  id: string,
): Promise<AxiosResponse<PermissionTicketType, any>> => {
  return instance.post(
    `/api/${keys.permissionTickets}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.permissionTickets,
      fieldAction: "read",
    }),
  );
};
export const HandleCreatePermissionTicket = ({
  restaurantId,
  createAt,
  employeeHandleId,
  employeeMainId,
  categoryPermissionTicketId,
  date,
  reason,
  status,
}: PermissionTicketType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.permissionTickets,
      fieldAction: "create",
    }),
    permissionTicket: {
      restaurantId,
      createAt,
      employeeHandleId,
      employeeMainId,
      categoryPermissionTicketId,
      date,
      reason,
      status,
    },
  };

  return instance.post(`/api/${keys.permissionTickets}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdatePermissionTicket = ({
  id,
  status,
}: PermissionTicketType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.permissionTickets,
      fieldAction: "update",
    }),
    permissionTicket: {
      status,
    },
  };

  return instance.put(`/api/${keys.permissionTickets}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
