import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { HandlePaymentType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api Xử lý hoá đơn (Handle Payment)
export const GetHandlePayment = (): Promise<
  AxiosResponse<HandlePaymentType, any>
> => {
  return instance.post(
    `/api/${keys.handlePayments}/get`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const GetHandlePaymentFormat = (): Promise<
  AxiosResponse<HandlePaymentType, any>
> => {
  return instance.post(
    `/api/${keys.handlePayments}/get-format`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const GetHandlePaymentByUseTableId = ({
  useTableId,
}: FilterDataProps): Promise<AxiosResponse<HandlePaymentType, any>> => {
  return instance.post(
    `/api/${keys.handlePayments}/get/${useTableId}`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const GetHandlePaymentFormatByUseTableId = ({
  useTableId,
}: FilterDataProps): Promise<AxiosResponse<HandlePaymentType, any>> => {
  return instance.post(
    `/api/${keys.handlePayments}/get-format/${useTableId}`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const GetHandlePaymentFormatByIsEmployeeHandle = (): Promise<
  AxiosResponse<HandlePaymentType, any>
> => {
  return instance.post(
    `/api/${keys.handlePayments}/get-format-is-employee-handle`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const GetHandlePaymentFormatByIsEmployeeHandleAndIsHandling = (): Promise<
  AxiosResponse<HandlePaymentType, any>
> => {
  return instance.post(
    `/api/${keys.handlePayments}/get-format-is-employee-handle-and-is-handling`,
    getNewFormSecurityValue({
      fieldName: keys.handlePayments,
      fieldAction: "read",
    })
  );
};
export const HandleUpdateHandlePayment = ({
  id,
  useTableId,
  employeeId,
  payMethodId,
  isEmployeeHandle,
  isHandling,
  payTotalPrice,
  status,
}: HandlePaymentType): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.handlePayments,
            fieldAction: "update",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Đối tượng
  formData.append(
    "handle-payment",
    new Blob(
      [
        JSON.stringify({
          useTableId,
          employeeId,
          payMethodId,
          isEmployeeHandle,
          isHandling,
          payTotalPrice,
          status,
        }),
      ],
      { type: "application/json" }
    )
  );

  return instance.put(`/api/${keys.handlePayments}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
