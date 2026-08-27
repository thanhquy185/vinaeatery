import { getActionNameVn } from "../utils/defaultActionsUtil";
import type { EmployeeDetailResponseType } from "../types/EmployeeType";

// Hàm lấy ra chuỗi các mã chức năng của người dùng đăng nhập hiện tại
export const getFunctionIdsString = ({
  currentEmployeeLogin,
}: {
  currentEmployeeLogin: EmployeeDetailResponseType;
}) => {
  return currentEmployeeLogin?.permission?.permissionDetails
    ?.filter(
      (permissionDetail) => permissionDetail.action === getActionNameVn(0),
    )
    .map((permissionDetail) => permissionDetail.function.id)
    .join("|");
};

// Hàm lấy ra chuỗi các hành động từ mã chức năng của người dùng đăng nhập hiện tại
export const getActionsString = ({
  currentInfoLogin,
  currentFunctionId,
}: {
  currentInfoLogin: EmployeeDetailResponseType;
  currentFunctionId: number;
}) => {
  return currentInfoLogin?.permission?.permissionDetails
    ?.filter(
      (permissionDetail) => permissionDetail.function.id == currentFunctionId,
    )
    .map((permissionDetail) => permissionDetail.action)
    .join("");
};
