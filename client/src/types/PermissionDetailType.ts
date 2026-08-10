import type { FunctionDetailResponseType } from "./FunctionType";

interface PermissionDetailIdEntityType {
  functionId: number;
  employeeId: number;
  action: string;
}

export interface PermissionDetailEntityType {
  id: PermissionDetailIdEntityType;
  function: FunctionDetailResponseType;
  action: string;
}

export interface PermissionDDetailResponseType {
  function: FunctionDetailResponseType;
  action: string;
}

export interface PermissionDetailCreateRequestType {
  functionId: number;
  action: string;
}

export interface PermissionDetailUpdateRequestType {
  functionId: number;
  action: string;
}
