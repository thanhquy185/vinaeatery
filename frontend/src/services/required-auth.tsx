import { useLocation, Navigate } from "react-router-dom";
// import { getFunctionIdsString, getUserLogin } from "./user-login";
import type { ReactNode } from "react";

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

  // Người dùng đang đăng nhập
  //   const userLogin = getUserLogin();
  //   if (!userLogin) {
  //     return <Navigate to="/login" state={{ from: location }} replace />;
  //   }

  // Chuỗi chứa mã các chức năng của người dùng
  //   const functionIdsString = getFunctionIdsString();
  //   if (requireFunctionId && !functionIdsString.includes(requireFunctionId)) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }

  return children;
};

export default RequireAuth;
