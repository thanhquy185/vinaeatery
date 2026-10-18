import type { UserDetailResponseType } from "./UserType";

export interface RestResponseType<T = any> {
  userLogin: UserDetailResponseType;
  status: number;
  error: string;
  message: string;
  data: T;
}
