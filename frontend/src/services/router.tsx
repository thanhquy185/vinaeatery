import { useEffect, useState, type JSX } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import type {
  EmployeesFormatType,
  FunctionsType,
  PayMethodsType,
} from "../common/types";
import AdminLayout from "../layouts/admin-layout";
import AdminDashboardProfitPage from "../pages/admin/dashboard/dashboard-profit";
import AdminDashboardOrdersPage from "../pages/admin/dashboard/dashboard-orders";
import AdminDashboardInputTicketsPage from "../pages/admin/dashboard/dashboard-input-tickets";
import AdminTableHistoriesPage from "../pages/admin/active/table-histories";
import AdminUseTablesPage from "../pages/admin/active/use-tables";
import AdminOrderSheetsPage from "../pages/admin/active/order-sheets";
import AdminOrdersPage from "../pages/admin/active/orders";
import AdminOrderTablesPage from "../pages/admin/active/order-tables";
import AdminCustomerCardsPage from "../pages/admin/manager-customer/customer-card";
import AdminCustomersPage from "../pages/admin/manager-customer/customers";
import AdminFloorsPage from "../pages/admin/manager-table/floors";
import AdminCategoryTablesPage from "../pages/admin/manager-table/category-tables";
import AdminTablesPage from "../pages/admin/manager-table/tables";
import AdminInputTicketsPage from "../pages/admin/manager-food/input-tickets";
import AdminSuppliersPage from "../pages/admin/manager-food/suppliers";
import AdminCategoryIngredientsPage from "../pages/admin/manager-food/category-ingredients";
import AdminIngredientsPage from "../pages/admin/manager-food/ingredients";
import AdminCategoryFoodsPage from "../pages/admin/manager-food/category-foods";
import AdminFoodsPage from "../pages/admin/manager-food/foods";
import AdminPayslipPage from "../pages/admin/manager-employee/payslip";
import AdminCategoryRewardPunishesPage from "../pages/admin/manager-employee/category-reward-punishes";
import AdminRewardPunishesPage from "../pages/admin/manager-employee/reward-punishes";
import AdminSchedulesPage from "../pages/admin/manager-employee/schedules";
import AdminShiftsPage from "../pages/admin/manager-employee/shifts";
import AdminRolesPage from "../pages/admin/manager-employee/roles";
import AdminEmployeesPage from "../pages/admin/manager-employee/employees";
import ClientLayout from "../layouts/client-layout";
// import ClientMainPage from "../pages/client/main";
import LoginPage from "../pages/public/login";
import PaymentPage from "../pages/public/payment";
import ErrorPage from "../pages/public/error";
import UnauthorizedPage from "../pages/public/unauthorized";
import { FindAllFunction, FindAllPayMethod, HandleAccount } from "./api";
import RequireAuth from "./required-auth";
import ClientPublicPage from "../pages/client/public";

// Router giúp chuyển hướng trang
// Chú thích
// - typeof createBrowserRouter: lấy kiểu của hàm createBrowserRouter
// - ReturnType<...>: lấy kiểu giá trị trả về của hàm đó
// - Promise<...>: vì hàm là async, nên nó trả về một Promise chứa kiểu router
export const getRouter = async (): Promise<
  ReturnType<typeof createBrowserRouter>
> => {
  // Nhân viên đăng nhập hiện tại
  const responseAuth = await HandleAccount();
  if (responseAuth?.status !== 200) {
    console.error("Truy vấn dữ liệu thất bại");
    return createBrowserRouter([]); // hoặc route lỗi
  }
  const employeeLogin = responseAuth.data as unknown as EmployeesFormatType;

  // Danh sách chức năng (truy vấn csdl)
  const responseFunction = await FindAllFunction();
  if (responseFunction?.status !== 200) {
    console.error("Truy vấn dữ liệu thất bại");
    return createBrowserRouter([]); // hoặc route lỗi
  }
  const functions = responseFunction.data as Array<FunctionsType>;

  // Hàm trả về page component tương ứng với chức năng
  const pageComponentMap: Record<
    string,
    React.ComponentType<{
      employeeLogin: EmployeesFormatType;
      functionId: number;
    }>
  > = {
    "dashboard-profit": AdminDashboardProfitPage,
    "dashboard-orders": AdminDashboardOrdersPage,
    "dashboard-input-tickets": AdminDashboardInputTicketsPage,
    "table-histories": AdminTableHistoriesPage,
    "use-tables": AdminUseTablesPage,
    "order-sheets": AdminOrderSheetsPage,
    orders: AdminOrdersPage,
    "order-tables": AdminOrderTablesPage,
    "customer-cards": AdminCustomerCardsPage,
    customers: AdminCustomersPage,
    floors: AdminFloorsPage,
    "category-tables": AdminCategoryTablesPage,
    tables: AdminTablesPage,
    "input-tickets": AdminInputTicketsPage,
    suppliers: AdminSuppliersPage,
    "category-ingredients": AdminCategoryIngredientsPage,
    ingredients: AdminIngredientsPage,
    "category-foods": AdminCategoryFoodsPage,
    foods: AdminFoodsPage,
    payslip: AdminPayslipPage,
    "category-reward-punishes": AdminCategoryRewardPunishesPage,
    "reward-punishes": AdminRewardPunishesPage,
    schedules: AdminSchedulesPage,
    shifts: AdminShiftsPage,
    roles: AdminRolesPage,
    employees: AdminEmployeesPage,
  };
  const getPageByFunctionNameEN = ({
    employeeLogin,
    functionId,
    nameEN,
  }: {
    employeeLogin: EmployeesFormatType;
    functionId: number;
    nameEN: string;
  }): JSX.Element | null => {
    const PageComponent = pageComponentMap[nameEN];

    if (PageComponent) {
      return (
        <PageComponent employeeLogin={employeeLogin} functionId={functionId} />
      );
    }

    return null;
  };

  return createBrowserRouter([
    {
      path: "/admin",
      element: <AdminLayout />,
      errorElement: <ErrorPage />,
      id: "admin",
      loader: () => {
        return { employeeLogin: employeeLogin, functions: functions };
      },
      children: functions?.map((func) => ({
        path: func.nameEN,
        element: (
          <RequireAuth requireFunctionId={func.id!}>
            {getPageByFunctionNameEN({
              employeeLogin: employeeLogin!,
              functionId: func.id!,
              nameEN: func.nameEN!,
            })}
          </RequireAuth>
        ),
      })),
    },
    {
      path: "/client/:tableId",
      element: <ClientLayout />,
      errorElement: <ErrorPage />,
    },
     {
      path: "/public",
      element: <ClientPublicPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/payment",
      element: <PaymentPage />,
    },
    {
      path: "/error",
      element: <ErrorPage />,
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
    },
  ]);
};
