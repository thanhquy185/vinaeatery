import { useRouteLoaderData } from "react-router-dom";
import type { EmployeesFormatType } from "../common/types";
import { getActionNameVn } from "./default-actions";

// Hàm lấy ra chuỗi các mã chức năng của người dùng đăng nhập hiện tại
export const getFunctionIdsString = (
    {
        currentEmployeeLogin
    }: { currentEmployeeLogin: EmployeesFormatType }
) => {
    return currentEmployeeLogin
        ?.currentRole?.roleDetails?.filter((roleDetail) => roleDetail.action === getActionNameVn(0))
        .map((roleDetail) => roleDetail.functionId)
        .join("|");
}

// Hàm lấy ra chuỗi các hành động từ mã chức năng của người dùng đăng nhập hiện tại
export const getActionsString = (
    {
        currentFunctionId
    }: { currentFunctionId: number }
) => {
    const infoLoginLogin = useRouteLoaderData("manager-info-login")!.infoLogin as EmployeesFormatType;

    return infoLoginLogin
        ?.currentRole?.roleDetails?.filter(
            (roleDetail) => roleDetail.functionId == currentFunctionId
        )
        .map((roleDetail) => roleDetail.action)
        .join("");
}