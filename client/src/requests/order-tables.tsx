import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { OrderTableType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Đơn đặt bàn (Order Table)
export const FindAllOrderTable = ({
  findType,
  findValue,
  arriveAtValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<OrderTableType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "customer-id") params.customerId = findValue!;
    if (findType! === "customer-fullname") params.customerFullname = findValue!;
    if (findType! === "customer-phone") params.customerPhone = findValue!;
    if (findType! === "customer-email") params.customerEmail = findValue!;
  }
  if (arriveAtValue! && arriveAtValue!.length > 0) {
    if (arriveAtValue![0] !== "") params.arriveAtStart = arriveAtValue![0];
    if (arriveAtValue![1] !== "") params.arriveAtEnd = arriveAtValue![1];
  }
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<OrderTableType[]>(
    `/api/${keys.orderTables}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.orderTables,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneOrderTable = (
  id: string,
): Promise<AxiosResponse<OrderTableType, any>> => {
  return instance.post(
    `/api/${keys.orderTables}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.orderTables,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateOrderTable = ({
  restaurantId,
  employeeId,
  customerId,
  createAt,
  arriveAt,
  customerFullname,
  customerPhone,
  customerEmail,
  customerNote,
  guests,
  status,
}: OrderTableType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orderTables,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "order-table",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          employeeId,
          customerId,
          createAt,
          arriveAt,
          customerFullname,
          customerPhone,
          customerEmail,
          customerNote,
          guests,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.post(`/api/${keys.orderTables}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateOrderTable = ({
  id,
  employeeId,
  status,
}: OrderTableType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orderTables,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "order-table",
    new Blob(
      [
        JSON.stringify({
          employeeId,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(
    `/api/${keys.orderTables}/update-status/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};
