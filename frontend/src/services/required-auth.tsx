import type { ReactNode } from "react";
import { useLocation, Navigate, useRouteLoaderData } from "react-router-dom";
import { getFunctionIdsString } from "./employee-login";

// Xác thực nguời dùng khi chuyển trang
const RequireAuth = ({
  children,
  requireFunctionId,
}: {
  children: ReactNode;
  requireFunctionId: number;
}) => {
  //
  const location = useLocation();

  // Nhân viên đang đăng nhập hiện tại
  const infoLogin = useRouteLoaderData("manager-info-login")!.infoLogin;

  // Nếu chưa đăng nhập thì đẩy về trang đăng nhập
  if (!infoLogin!.id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Chuỗi chứa mã các chức năng của nhân viên
  const functionIdsString = getFunctionIdsString({ currentEmployeeLogin: infoLogin });  
  if (!requireFunctionId || !functionIdsString || (requireFunctionId && functionIdsString
    && !functionIdsString.split("|").some(
      (functionIdString) => functionIdString === String(requireFunctionId)
    )
  )) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireAuth;
