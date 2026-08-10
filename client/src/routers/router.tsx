import AllowRouter from "./AllowRouter";
import DefaultRouter from "./DefaultRouter";
import PublicRouter from "./PublicRouter";
import AdminRouter from "./AdminRouter";
import ManagerEmployeeRouter from "./ManagerEmployeeRouter";
import AuthApiService from "../services/api/v1/AuthApiService";
import { createBrowserRouter } from "react-router-dom";
import { UserRoleValue } from "../constants/values";
import type { ManagerDetailResponseType } from "../types/ManagerType";
import type { EmployeeDetailResponseType } from "../types/EmployeeType";
import type { CustomerDetailResponseType } from "../types/CustomerType";

// Router giúp chuyển hướng trang
// Chú thích
// - typeof createBrowserRouter: lấy kiểu của hàm createBrowserRouter
// - ReturnType<...>: lấy kiểu giá trị trả về của hàm đó
// - Promise<...>: vì hàm là async, nên nó trả về một Promise chứa kiểu router
export const getRouter = async (): Promise<
  ReturnType<typeof createBrowserRouter>
> => {
  // Người dùng đăng nhập hiện tại
  const responseUserLogin = await AuthApiService.handleGetInfo();
  if (responseUserLogin.status !== 200) {
    console.error("Truy vấn dữ liệu thất bại");
    return createBrowserRouter(AllowRouter({}));
  }
  const infoLogin = responseUserLogin.data as any;

  // Các biến kiểm tra quyền tài khoản
  const isManager =
    (infoLogin as ManagerDetailResponseType).user &&
    (infoLogin as ManagerDetailResponseType).user.role ===
      UserRoleValue.manager;
  const isEmployee =
    (infoLogin as EmployeeDetailResponseType).user &&
    (infoLogin as EmployeeDetailResponseType).user.role ===
      UserRoleValue.employee;
  const isCustomer =
    (infoLogin as CustomerDetailResponseType).user &&
    (infoLogin as CustomerDetailResponseType).user.role ===
      UserRoleValue.customer;
  const isAdmin = !isManager && !isEmployee && !isCustomer;

  // Các router
  const defaultRouter = DefaultRouter({});
  const publicRouter = PublicRouter({ isCustomer, infoLogin });
  const adminRouter = AdminRouter({
    isAdmin,
    isManager,
    isEmployee,
    infoLogin,
  });
  const managerEmployeeRouter = await ManagerEmployeeRouter({
    isAdmin,
    isManager,
    isEmployee,
    infoLogin,
  });

  if (isAdmin && adminRouter) {
    return createBrowserRouter([defaultRouter, publicRouter, adminRouter]);
  }
  if ((isManager || isEmployee) && managerEmployeeRouter) {
    return createBrowserRouter([
      defaultRouter,
      publicRouter,
      managerEmployeeRouter,
    ]);
  }

  return createBrowserRouter([defaultRouter, publicRouter]);
};
