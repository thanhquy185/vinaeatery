import type { EmployeeEntityType } from "./EmployeeType";
import type { RoleEntityType, RoleInfoResponseType } from "./RoleType";

interface RoleHistoryIdEntityType {
  employeeId: number;
  roleId: number;
  dateStart: string;
}

export interface RoleHistoryEntityType {
  id: RoleHistoryIdEntityType;
  employee: EmployeeEntityType;
  role: RoleEntityType;
  dateStart: string;
  dateEnd: string;
}

export interface RoleHistoryDetailResponseType {
  role: RoleInfoResponseType;
  dateStart: string;
  dateEnd: string;
}
