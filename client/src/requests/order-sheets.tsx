import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { OrderSheetType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Phiếu gọi món (Order Sheet)
export const FindAllOrderSheet = ({
  findType,
  findValue,
  floorValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<OrderSheetType[], any>> => {
  const params: Record<string, string> = {};

  // if (findValue! !== "") {
  //   if (findType! === "id") params.id = findValue!;
  //   if (findType! === "table") params.tableName = findValue!;
  // }
  // if (timeValue! && timeValue!.length > 0) {
  //   if (timeValue![0] !== "") params.createAtStart = timeValue![0];
  //   if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  // }
  if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<OrderSheetType[]>(
    `/api/${keys.orderSheets}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.orderSheets,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindAllOrderSheetCurrentDate = ({
  findType,
  findValue,
  floorValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<OrderSheetType[], any>> => {
  const params: Record<string, string> = {};

  if (findValue! !== "") {
    // if (findType! === "id") params.id = findValue!;
    if (findType! === "table") params.tableName = findValue!;
  }
  if (floorValue! && floorValue!.length > 0) params.floorId = floorValue![0];
  if (statusValue! && statusValue!.length > 0) params.status = statusValue![0];
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<OrderSheetType[]>(
    `/api/${keys.orderSheets}/list-format?currentDate`,
    getNewFormSecurityValue({
      fieldName: keys.orderSheets,
      fieldAction: "read",
    }),
    {
      params,
    }
  );
};
export const FindOneOrderSheet = (
  id: string
): Promise<AxiosResponse<OrderSheetType, any>> => {
  return instance.post(
    `/api/${keys.orderSheets}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.orderSheets,
      fieldAction: "read",
    })
  );
};
export const HandleCreateOrderSheet = ({
  restaurantId,
  createAt,
  employeeId,
  tableId,
  totalPrice,
  note,
  status,
  orderSheetDetails,
}: OrderSheetType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orderSheets,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Thông tin cơ bản
  formData.append(
    "order-sheet",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          createAt,
          employeeId,
          tableId,
          totalPrice,
          note,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );
  // Chi tiết phiếu gọi món
  if (orderSheetDetails)
    formData.append(
      "order-sheet-details",
      new Blob([JSON.stringify(orderSheetDetails)], {
        type: "application/json",
      })
    );

  return instance.post(`/api/${keys.orderSheets}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateOrderSheet = ({
  id,
  serviceAt,
  employeeId,
  message,
  status,
}: OrderSheetType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orderSheets,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "order-sheet",
    new Blob(
      [
        JSON.stringify({
          serviceAt,
          employeeId,
          message,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.orderSheets}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
