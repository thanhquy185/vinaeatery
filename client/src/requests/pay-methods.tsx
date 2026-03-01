import type { AxiosResponse } from "axios";
import type { PayMethodType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Phương thức thanh toán (Pay Method)
export const FindAllPayMethod = (): Promise<
  AxiosResponse<PayMethodType[], any>
> => {
  return instance.post<PayMethodType[]>(
    `/api/${keys.payMethods}/list`,
    getNewFormSecurityValue({ fieldName: keys.payMethods, fieldAction: "read" })
  );
};
