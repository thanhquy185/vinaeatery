import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api thanh toán hoá đơn
// - Momo
export const HandleCreateMomoOrder = ({
  handlePaymentId,
}: FilterDataProps): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = new FormData();
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.momo,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(
    `/api/${keys.momo}/create/${handlePaymentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const HandleCancelMomoOrder = ({
  orderId,
  orderAmount,
}: FilterDataProps): Promise<AxiosResponse<RestResponseType, any>> => {
  // Form data
  const formData = new FormData();

  // Form bảo mật
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.momo,
            fieldAction: "cancel",
          })
        ),
      ],
      { type: "application/json" }
    )
  );
  // Tổng thanh toán
  formData.append("amount", orderAmount?.toString()!);

  return instance.post(`/api/momo/cancel/${orderId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// - Zalopay
export const HandleCreateZalopayOrder = ({
  handlePaymentId,
}: FilterDataProps): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = new FormData();
  formData.append(
    "form-security",
    new Blob(
      [
        JSON.stringify(
          getNewFormSecurityValue({
            fieldName: keys.zalopay,
            fieldAction: "create",
          })
        ),
      ],
      { type: "application/json" }
    )
  );

  return instance.post(
    `/api/${keys.zalopay}/create/${handlePaymentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
