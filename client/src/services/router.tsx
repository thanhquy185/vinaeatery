import { useEffect, useState, type JSX } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import type { ManagerPageProps } from "../common/props";
import type {
  CustomerType,
  EmployeeType,
  FunctionType,
  ManagerType,
  PayMethodType,
  UserType,
} from "../common/types";
import { UserRoleValue } from "../common/values";
import OAuth2RedirectHandler from "../components/common/OAuth2RedirectHandler";
import PublicLayout from "../layouts/public-layout";
import AdminManagerLayout from "../layouts/admin-manager-layout";
import CallFoodLayout from "../layouts/call-food-layout";
import PublicHomePage from "../pages/public/home";
import PublicRestaurantPage from "../pages/public/restaurant";
import PublicProfilePage from "../pages/public/profile";
import PublicOrderRestaurantPage from "../pages/public/order-restaurant";
import PublicHistoryPage from "../pages/public/history";
import PublicChangePasswordPage from "../pages/public/change-password";
import AdminRestaurantsPage from "../pages/admin/restaurants";
import AdminManagersPage from "../pages/admin/managers";
import AdminCustomersPage from "../pages/admin/customers";
import AdminUsersPage from "../pages/admin/users";
import ManagerRestaurantInfoPage from "../pages/manager/other/restaurant-info";
import ManagerDashboardProfitPage from "../pages/manager/dashboard/dashboard-profit";
import ManagerDashboardOrdersPage from "../pages/manager/dashboard/dashboard-orders";
import ManagerDashboardInputTicketsPage from "../pages/manager/dashboard/dashboard-input-tickets";
import ManagerDashboardHumanPage from "../pages/manager/dashboard/dashboard-human";
import ManagerTableHistoriesPage from "../pages/manager/active/table-histories";
import ManagerUseTablesPage from "../pages/manager/active/use-tables";
import ManagerUseFoodsPage from "../pages/manager/active/use-foods";
import ManagerOrderSheetsPage from "../pages/manager/active/order-sheets";
import ManagerMessages from "../pages/manager/active/messages";
import ManagerOrdersPage from "../pages/manager/active/orders";
import ManagerOrderTablesPage from "../pages/manager/active/order-tables";
import ManagerFloorsPage from "../pages/manager/manager-table/floors";
import ManagerCategoryTablesPage from "../pages/manager/manager-table/category-tables";
import ManagerTablesPage from "../pages/manager/manager-table/tables";
import ManagerInputTicketsPage from "../pages/manager/manager-food/input-tickets";
import ManagerSuppliersPage from "../pages/manager/manager-food/suppliers";
import ManagerCategoryIngredientsPage from "../pages/manager/manager-food/category-ingredients";
import ManagerIngredientsPage from "../pages/manager/manager-food/ingredients";
import ManagerCategoryFoodsPage from "../pages/manager/manager-food/category-foods";
import ManagerFoodsPage from "../pages/manager/manager-food/foods";
import ManagerPayslipsPage from "../pages/manager/manager-employee/payslips";
import ManagerAttendancesPage from "../pages/manager/manager-employee/attendances";
import ManagerSalaryAdvancesPage from "../pages/manager/manager-employee/salary-advances";
import ManagerCategoryInsurancesPage from "../pages/manager/manager-employee/category-insurances";
import ManagerInsurancesPage from "../pages/manager/manager-employee/insurances";
import ManagerCategoryAllowancesPage from "../pages/manager/manager-employee/category-allowances";
import ManagerAllowancesPage from "../pages/manager/manager-employee/allowances";
import ManagerCategoryPermissionTicketsPage from "../pages/manager/manager-employee/category-permission-tickets";
import ManagerPermissionTicketsPage from "../pages/manager/manager-employee/permission-tickets";
import ManagerCategoryRewardPunishesPage from "../pages/manager/manager-employee/category-reward-punishes";
import ManagerRewardPunishesPage from "../pages/manager/manager-employee/reward-punishes";
import ManagerSchedulesPage from "../pages/manager/manager-employee/schedules";
import ManagerShiftsPage from "../pages/manager/manager-employee/shifts";
import ManagerPermissionsPage from "../pages/manager/manager-employee/permissions";
import ManagerRolesPage from "../pages/manager/manager-employee/roles";
import ManagerEmployeesPage from "../pages/manager/manager-employee/employees";
import AttendanceMachinePage from "../pages/other/attendance-machine";
import LoginPage from "../pages/other/login";
import PaymentPage from "../pages/other/payment";
import ErrorPage from "../pages/other/error";
import UnauthorizedPage from "../pages/other/unauthorized";
import RequireAuth from "./required-auth";
import { FindAllFunction } from "../requests/functions";
import { HandleAccount } from "../requests/auth";

// Router giúp chuyển hướng trang
// Chú thích
// - typeof createBrowserRouter: lấy kiểu của hàm createBrowserRouter
// - ReturnType<...>: lấy kiểu giá trị trả về của hàm đó
// - Promise<...>: vì hàm là async, nên nó trả về một Promise chứa kiểu router
export const getRouter = async (): Promise<
  ReturnType<typeof createBrowserRouter>
> => {
  // Các route cho phép khi chưa đăng nhập tài khoản
  const routesIsAllow = [
    {
      path: "/public",
      element: <PublicLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <PublicHomePage />,
        },
        {
          path: "restaurant",
          element: <PublicRestaurantPage />,
        },
        // {
        //   path: "history",
        //   element: <PublicHistoryPage />,
        // },
        {
          path: "profile",
          element: <PublicProfilePage />,
        },
        {
          path: "order-restaurant",
          element: <PublicOrderRestaurantPage />,
        },
        {
          path: "change-password",
          element: <PublicChangePasswordPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/oauth2/redirect",
      element: <OAuth2RedirectHandler />,
    },
  ];

  // Người dùng đăng nhập hiện tại
  const responseUserLogin = await HandleAccount();
  if (responseUserLogin?.status !== 200) {
    console.error("Truy vấn dữ liệu thất bại");
    return createBrowserRouter(routesIsAllow);
  }
  const infoLogin = responseUserLogin.data as unknown as EmployeeType;

  // Các biến kiểm tra quyền tài khoản
  const isManagerLogin =
    infoLogin?.user && infoLogin?.user?.role === UserRoleValue.manager;
  const isEmployeeLogin =
    infoLogin?.user && infoLogin?.user?.role === UserRoleValue.employee;
  const isCustomerLogin =
    infoLogin?.user && infoLogin?.user?.role === UserRoleValue.customer;
  const isAdminLogin = !isManagerLogin && !isEmployeeLogin && !isCustomerLogin;

  // Danh sách chức năng (truy vấn csdl)
  const responseFunction = await FindAllFunction();
  if (responseFunction?.status !== 200) {
    console.error("Truy vấn dữ liệu thất bại");
    return createBrowserRouter(routesIsAllow);
  }
  const functions = responseFunction.data as Array<FunctionType>;

  // Hàm trả về page component tương ứng với chức năng
  const pageComponentMap: Record<
    string,
    React.ComponentType<{
      infoLogin: ManagerType | EmployeeType;
      functionId: number;
      nameVN: string;
      nameEN: string;
    }>
  > = {
    "dashboard-profit": ManagerDashboardProfitPage,
    "dashboard-orders": ManagerDashboardOrdersPage,
    "dashboard-input-tickets": ManagerDashboardInputTicketsPage,
    "dashboard-human": ManagerDashboardHumanPage,
    "table-histories": ManagerTableHistoriesPage,
    "use-tables": ManagerUseTablesPage,
    "use-foods": ManagerUseFoodsPage,
    "order-sheets": ManagerOrderSheetsPage,
    messages: ManagerMessages,
    orders: ManagerOrdersPage,
    "order-tables": ManagerOrderTablesPage,
    floors: ManagerFloorsPage,
    "category-tables": ManagerCategoryTablesPage,
    tables: ManagerTablesPage,
    "input-tickets": ManagerInputTicketsPage,
    suppliers: ManagerSuppliersPage,
    "category-ingredients": ManagerCategoryIngredientsPage,
    ingredients: ManagerIngredientsPage,
    "category-foods": ManagerCategoryFoodsPage,
    foods: ManagerFoodsPage,
    payslips: ManagerPayslipsPage,
    attendances: ManagerAttendancesPage,
    "salary-advances": ManagerSalaryAdvancesPage,
    schedules: ManagerSchedulesPage,
    shifts: ManagerShiftsPage,
    "category-allowances": ManagerCategoryAllowancesPage,
    allowances: ManagerAllowancesPage,
    "category-insurances": ManagerCategoryInsurancesPage,
    insurances: ManagerInsurancesPage,
    "category-permission-tickets": ManagerCategoryPermissionTicketsPage,
    "permission-tickets": ManagerPermissionTicketsPage,
    "category-reward-punishes": ManagerCategoryRewardPunishesPage,
    "reward-punishes": ManagerRewardPunishesPage,
    roles: ManagerRolesPage,
    permissions: ManagerPermissionsPage,
    employees: ManagerEmployeesPage,
  };
  const getPageByFunctionNameEN = ({
    infoLogin,
    functionId,
    nameVN,
    nameEN,
  }: ManagerPageProps): JSX.Element | null => {
    const selectedRestaurantId = Number(
      sessionStorage.getItem("selected-restaurant-id"),
    );
    if (isManagerLogin && selectedRestaurantId === 0) {
      return <Navigate to="/manager" replace />;
    }

    const PageComponent = pageComponentMap[nameEN!];

    if (PageComponent) {
      return (
        <PageComponent
          infoLogin={infoLogin!}
          functionId={functionId}
          nameVN={nameVN!}
          nameEN={nameEN!}
        />
      );
    }

    return null;
  };

  // Hàm xử lý router cho quản lý
  const getRestaurantInfoRouteForManager = () => {
    const selectedRestaurantId = Number(
      sessionStorage.getItem("selected-restaurant-id"),
    );

    const paths = ["restaurant-info"];
    if (isManagerLogin && selectedRestaurantId === 0) {
      return [
        ...paths.map((path) => ({
          path,
          element: <Navigate to="/manager" replace />,
        })),
      ];
    }

    if (isManagerLogin) {
      return [
        { path: "restaurant-info", element: <ManagerRestaurantInfoPage /> },
      ];
    }

    return [];
  };

  return createBrowserRouter([
    {
      path: isAdminLogin ? "/admin" : isManagerLogin ? "/manager" : "/employee",
      element: <AdminManagerLayout />,
      errorElement: <ErrorPage />,
      id: "manager-info-login",
      loader: () => {
        return {
          infoLogin: infoLogin,
          functions: isAdminLogin ? undefined : functions,
        };
      },
      children: isAdminLogin
        ? [
            {
              path: "restaurants",
              element: <AdminRestaurantsPage />,
            },
            {
              path: "managers",
              element: <AdminManagersPage />,
            },
            {
              path: "customers",
              element: <AdminCustomersPage />,
            },
            {
              path: "users",
              element: <AdminUsersPage />,
            },
          ]
        : [
            ...getRestaurantInfoRouteForManager(),
            ...(functions?.map((func) => ({
              path: func.nameEN,
              element: isManagerLogin ? (
                getPageByFunctionNameEN({
                  infoLogin: infoLogin!,
                  functionId: func.id!,
                  nameVN: func.nameVN!,
                  nameEN: func.nameEN!,
                })
              ) : (
                <RequireAuth requireFunctionId={func.id!}>
                  {getPageByFunctionNameEN({
                    infoLogin: infoLogin!,
                    functionId: func.id!,
                    nameVN: func.nameVN!,
                    nameEN: func.nameEN!,
                  })}
                </RequireAuth>
              ),
            })) ?? []),
          ],
    },
    {
      path: "/public",
      element: <PublicLayout />,
      errorElement: <ErrorPage />,
      id: "public-info-login",
      loader: () => {
        return {
          infoLogin: infoLogin,
        };
      },
      children: [
        {
          path: "",
          element: <PublicHomePage />,
        },
        {
          path: "restaurant",
          element: <PublicRestaurantPage />,
        },
        // {
        //   path: "history",
        //   element: <PublicHistoryPage />,
        // },
        {
          path: "profile",
          element: <PublicProfilePage />,
        },
        {
          path: "order-restaurant",
          element: <PublicOrderRestaurantPage />,
        },
        {
          path: "change-password",
          element: <PublicChangePasswordPage />,
        },
      ],
    },
    {
      path: "/call-food/:restaurantId/:tableId",
      element: <CallFoodLayout />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/payment",
      element: <PaymentPage />,
    },
    // {
    //   path: "/build",
    //   element: <AdminManagerLayout />,
    //   id: "build-manager-info-login",
    //   loader: () => {
    //     return {
    //       infoLogin: infoLogin,
    //       functions: isAdminLogin ? undefined : functions,
    //     };
    //   },
    //   children: [
    //     {
    //       path: "dashboard-human",
    //       element: (
    //         <ManagerDashboardHumanPage
    //           infoLogin={infoLogin!}
    //           functionId={11}
    //           nameVN="Thống kê Nhân sự"
    //           nameEN="dashboard-human"
    //         />
    //       ),
    //     },
    //   ],
    // },
    {
      path: "attendance-machine",
      element: <AttendanceMachinePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
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
