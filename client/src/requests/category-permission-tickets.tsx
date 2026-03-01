import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type {
  CategoryPermissionTicketType,
  RestResponseType,
} from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Loại đơn xin phép (Category Permission Ticket)
export const FindAllCategoryPermissionTicket = ({
  findType,
  findValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<
  AxiosResponse<CategoryPermissionTicketType[], any>
> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "name") params.name = findValue!;
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<CategoryPermissionTicketType[]>(
    `/api/${keys.categoryPermissionTickets}/list`,
    getNewFormSecurityValue({
      fieldName: keys.categoryPermissionTickets,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneCategoryPermissionTicket = (
  id: string,
): Promise<AxiosResponse<CategoryPermissionTicketType, any>> => {
  return instance.post(
    `/api/${keys.categoryPermissionTickets}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.categoryPermissionTickets,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateCategoryPermissionTicket = ({
  restaurantId,
  name,
  description,
  status,
}: CategoryPermissionTicketType): Promise<
  AxiosResponse<RestResponseType, any>
> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryPermissionTickets,
      fieldAction: "create",
    }),
    categoryPermissionTicket: {
      restaurantId,
      name,
      description,
      status,
    },
  };

  return instance.post(
    `/api/${keys.categoryPermissionTickets}/create`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
export const HandleUpdateCategoryPermissionTicket = ({
  id,
  name,
  description,
}: CategoryPermissionTicketType): Promise<
  AxiosResponse<RestResponseType, any>
> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryPermissionTickets,
      fieldAction: "update",
    }),
    categoryPermissionTicket: {
      name,
      description,
    },
  };

  return instance.put(
    `/api/${keys.categoryPermissionTickets}/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
export const HandleLockCategoryPermissionTicket = ({
  id,
  status,
}: CategoryPermissionTicketType): Promise<
  AxiosResponse<RestResponseType, any>
> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.categoryPermissionTickets,
      fieldAction: "lock",
    }),
    categoryPermissionTicket: {
      status,
    },
  };

  return instance.patch(
    `/api/${keys.categoryPermissionTickets}/lock/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
