import type { AxiosResponse } from "axios";
import type { FunctionType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Chức năng (Function)
export const FindAllFunction = (): Promise<
  AxiosResponse<FunctionType[], any>
> => {
  return instance.post<FunctionType[]>(
    `/api/${keys.functions}/list`,
    getNewFormSecurityValue({ fieldName: keys.functions, fieldAction: "read" })
  );
};
