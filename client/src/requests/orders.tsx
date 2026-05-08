import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { OrderType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Đơn món ăn (Order)
export const FindAllOrder = ({
  findType,
  findValue,
  timeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<OrderType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
    if (findType! === "customer") params.customerId = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.createAtStart = timeValue![0];
    if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<OrderType[]>(
    `/api/orders/list-format`,
    getNewFormSecurityValue({ fieldName: keys.orders, fieldAction: "read" }),
    {
      params,
    },
  );
};
export const FindOneOrder = (
  id: string,
): Promise<AxiosResponse<OrderType, any>> => {
  return instance.post(
    `/api/orders/detail/${id}`,
    getNewFormSecurityValue({ fieldName: keys.orders, fieldAction: "read" }),
  );
};
export const HandleCreateOrder = ({
  restaurantId,
  createAt,
  employeeId,
  customerId,
  customerFullname,
  customerPhone,
  customerEmail,
  totalPrice,
  payId,
  payTime,
  payMethodId,
  payTotalPrice,
  payStatus,
  status,
  orderDetails,
}: OrderType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orders,
            fieldAction: "create",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Thông tin cơ bản
  formData.append(
    "order",
    new Blob(
      [
        JSON.stringify({
          restaurantId,
          createAt,
          employeeId,
          customerId,
          customerFullname,
          customerPhone,
          customerEmail,
          totalPrice,
          payId,
          payTime,
          payMethodId,
          payTotalPrice,
          payStatus,
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );
  // Chi tiết đơn hàng
  if (orderDetails)
    formData.append(
      "order-details",
      new Blob([JSON.stringify(orderDetails)], {
        type: "application/json",
      }),
    );

  return instance.post(`/api/${keys.orders}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const HandleUpdateOrder = ({
  id,
  status,
}: OrderType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.orders,
            fieldAction: "update",
          }),
        ),
      ],
      { type: "application/json" },
    ),
  );
  // Đối tượng
  formData.append(
    "order",
    new Blob(
      [
        JSON.stringify({
          status,
        }),
      ],
      { type: "application/json" },
    ),
  );

  return instance.put(`/api/${keys.orders}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// export const HandleUpdateOrderPayStatus = ({
//   id,
//   payStatus,
// }: OrderType): Promise<AxiosResponse<RestResponseType, any>> => {
//   // Form data
//   const formData = new FormData();

//   // Form bảo mật
//   formData.append(
//     "form-security",
//     new Blob(
//       [
//         JSON.stringify(
//           getNewFormSecurityValue({
//             fieldName: keys.orders,
//             fieldAction: "update",
//           })
//         ),
//       ],
//       { type: "application/json" }
//     )
//   );
//   // Đối tượng
//   formData.append(
//     "order",
//     new Blob(
//       [
//         JSON.stringify({
//           payStatus,
//         }),
//       ],
//       { type: "application/json" }
//     )
//   );

//   return instance.put(`/api/${keys.orders}/update-payment/${id}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };
