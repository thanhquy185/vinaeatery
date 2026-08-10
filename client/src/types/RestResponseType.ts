import type { UserType } from "../common/types";

export interface RestResponseType<T = any> {
  userLogin: UserType;
  status: number;
  error: string;
  message: string;
  data: T;
}
