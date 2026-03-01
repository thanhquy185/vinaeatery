import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { InputTicketType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Phiếu nhập (Input Ticket)
export const FindAllInputTicket = ({
  findType,
  findValue,
  timeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<InputTicketType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "supplier") params.supplierId = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.createAtStart = timeValue![0];
    if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<InputTicketType[]>(
    `/api/${keys.inputTickets}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.inputTickets,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneInputTicket = (
  id: string
): Promise<AxiosResponse<InputTicketType, any>> => {
  return instance.post(
    `/api/${keys.inputTickets}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.inputTickets,
      fieldAction: "read",
    })
  );
};
export const HandleCreateInputTicket = ({
  restaurantId,
  employeeId,
  supplierId,
  totalPrice,
  payStatus,
  status,
  inputTicketDetails,
}: InputTicketType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.inputTickets,
      fieldAction: "create",
    }),
    inputTicket: {
      restaurantId,
      employeeId,
      supplierId,
      totalPrice,
      payStatus,
      status,
    },
    inputTicketDetails,
  };

  return instance.post(`/api/${keys.inputTickets}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateInputTicket = ({
  id,
  payStatus,
  status,
}: InputTicketType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.inputTickets,
      fieldAction: "update",
    }),
    inputTicket: {
      payStatus,
      status,
    },
  };

  return instance.put(`/api/${keys.inputTickets}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
