import { useEffect, useState, type JSX } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import type {
  CustomersFormatType,
  EmployeesFormatType,
  FunctionsType,
  ManagersFormatType,
  PayMethodsType,
  UsersType,
} from "../common/types";
import AdminManagerLayout from "../layouts/admin-manager-layout";
import AdminRestaurantsPage from "../pages/admin/restaurants";
import AdminManagersPage from "../pages/admin/managers";
import AdminCustomersPage from "../pages/admin/customers";
import AdminUsersPage from "../pages/admin/users";
import ManagerRestaurantInfoPage from "../pages/manager/other/restaurant-info";
import ManagerDashboardProfitPage from "../pages/manager/dashboard/dashboard-profit";
import ManagerDashboardOrdersPage from "../pages/manager/dashboard/dashboard-orders";
import ManagerDashboardInputTicketsPage from "../pages/manager/dashboard/dashboard-input-tickets";
import ManagerTableHistoriesPage from "../pages/manager/active/table-histories";
import ManagerUseTablesPage from "../pages/manager/active/use-tables";
import ManagerUseFoodsPage from "../pages/manager/active/use-foods";
import ManagerOrderSheetsPage from "../pages/manager/active/order-sheets";
import ManagerMessages from "../pages/manager/active/messages";
import ManagerOrdersPage from "../pages/manager/active/orders";
import ManagerOrderTablesPage from "../pages/manager/active/order-tables";
// import ManagerCustomerCardsPage from "../pages/manager/manager-customer/customer-card";
// import ManagerCustomersPage from "../pages/manager/manager-customer/customers";
import ManagerFloorsPage from "../pages/manager/manager-table/floors";
import ManagerCategoryTablesPage from "../pages/manager/manager-table/category-tables";
import ManagerTablesPage from "../pages/manager/manager-table/tables";
import ManagerInputTicketsPage from "../pages/manager/manager-food/input-tickets";
import ManagerSuppliersPage from "../pages/manager/manager-food/suppliers";
import ManagerCategoryIngredientsPage from "../pages/manager/manager-food/category-ingredients";
import ManagerIngredientsPage from "../pages/manager/manager-food/ingredients";
import ManagerCategoryFoodsPage from "../pages/manager/manager-food/category-foods";
import ManagerFoodsPage from "../pages/manager/manager-food/foods";
import ManagerRolesPage from "../pages/manager/manager-employee/roles";
import ManagerEmployeesPage from "../pages/manager/manager-employee/employees";
import CallFoodLayout from "../layouts/call-food-layout";
import LoginPage from "../pages/other/login";
import LandingPage from "../pages/other/landing";
import PaymentPage from "../pages/other/payment";
import ErrorPage from "../pages/other/error";
import UnauthorizedPage from "../pages/other/unauthorized";
import type { ManagerPageProps } from "../common/props";
import { FindAllFunction, HandleAccount } from "./api";
import RequireAuth from "./required-auth";
import { UserRoleValue } from "../common/values";
import PublicLayout from "../layouts/public-layout";
import PublicHomePage from "../pages/public/home";
import PublicRestaurantPage from "../pages/public/restaurant";
import PublicProfilePage from "../pages/public/profile";
import PublicOrderRestaurantPage from "../pages/public/order-restaurant";
import PublicHistoryPage from "../pages/public/history";
import PublicChangePasswordPage from "../pages/public/change-password";
import OAuth2RedirectHandler from "../components/common/OAuth2RedirectHandler";

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
  const infoLogin = responseUserLogin.data as unknown as EmployeesFormatType;

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
  const functions = responseFunction.data as Array<FunctionsType>;

  // Hàm trả về page component tương ứng với chức năng
  const pageComponentMap: Record<
    string,
    React.ComponentType<{
      infoLogin: ManagersFormatType | EmployeesFormatType;
      functionId: number;
    }>
  > = {
    "dashboard-profit": ManagerDashboardProfitPage,
    "dashboard-orders": ManagerDashboardOrdersPage,
    "dashboard-input-tickets": ManagerDashboardInputTicketsPage,
    "table-histories": ManagerTableHistoriesPage,
    "use-tables": ManagerUseTablesPage,
    "use-foods": ManagerUseFoodsPage,
    "order-sheets": ManagerOrderSheetsPage,
    messages: ManagerMessages,
    orders: ManagerOrdersPage,
    "order-tables": ManagerOrderTablesPage,
    // "customer-cards": ManagerCustomerCardsPage,
    // customers: ManagerCustomersPage,
    floors: ManagerFloorsPage,
    "category-tables": ManagerCategoryTablesPage,
    tables: ManagerTablesPage,
    "input-tickets": ManagerInputTicketsPage,
    suppliers: ManagerSuppliersPage,
    "category-ingredients": ManagerCategoryIngredientsPage,
    ingredients: ManagerIngredientsPage,
    "category-foods": ManagerCategoryFoodsPage,
    foods: ManagerFoodsPage,
    roles: ManagerRolesPage,
    employees: ManagerEmployeesPage,
  };
  const getPageByFunctionNameEN = ({
    infoLogin,
    functionId,
    nameEN,
  }: ManagerPageProps): JSX.Element | null => {
    const selectedRestaurantId = Number(
      sessionStorage.getItem("selected-restaurant-id")
    );
    if (isManagerLogin && selectedRestaurantId === 0) {
      return <Navigate to="/manager" replace />;
    }

    const PageComponent = pageComponentMap[nameEN!];

    if (PageComponent) {
      return <PageComponent infoLogin={infoLogin!} functionId={functionId} />;
    }

    return null;
  };

  // Hàm xử lý router cho quản lý
  const getRestaurantInfoRouteForManager = () => {
    const selectedRestaurantId = Number(
      sessionStorage.getItem("selected-restaurant-id")
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
                  nameEN: func.nameEN!,
                })
              ) : (
                <RequireAuth requireFunctionId={func.id!}>
                  {getPageByFunctionNameEN({
                    infoLogin: infoLogin!,
                    functionId: func.id!,
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
      path: "/public",
      element: <LandingPage />,
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
