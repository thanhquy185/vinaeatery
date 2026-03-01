import { useRouteLoaderData } from "react-router-dom";
import type { EmployeeType } from "../common/types";
import { getActionNameVn } from "../utils/default-actions";

// Hàm lấy ra chuỗi các mã chức năng của người dùng đăng nhập hiện tại
export const getFunctionIdsString = ({
  currentEmployeeLogin,
}: {
  currentEmployeeLogin: EmployeeType;
}) => {
  return currentEmployeeLogin?.permission?.permissionDetails
    ?.filter(
      (permissionDetail) => permissionDetail.action === getActionNameVn(0),
    )
    .map((permissionDetail) => permissionDetail.functionId)
    .join("|");
};

// Hàm lấy ra chuỗi các hành động từ mã chức năng của người dùng đăng nhập hiện tại
export const getActionsString = ({
  currentInfoLogin,
  currentFunctionId,
}: {
  currentInfoLogin: EmployeeType;
  currentFunctionId: number;
}) => {
  // const infoLoginLogin = useRouteLoaderData("manager-info-login")!
  //   .infoLogin as EmployeeType;

  return currentInfoLogin?.permission?.permissionDetails
    ?.filter(
      (permissionDetail) => permissionDetail.functionId == currentFunctionId,
    )
    .map((permissionDetail) => permissionDetail.action)
    .join("");
};
