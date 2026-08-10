import AdminManagerLayout from "../layouts/AdminManagerLayout";
import OtherErrorPage from "../pages/other/ErrorPage";
import ManagerRestaurantPage from "../pages/manager/other/RestaurantPage";
import ManagerSummaryPage from "../pages/manager/other/SummaryPage";
import ManagerChatbotPage from "../pages/manager/other/ChatbotPage";
import ManagerDashboardProfitPage from "../pages/manager/dashboard/ProfitPage";
import ManagerDashboardRevenuePage from "../pages/manager/dashboard/RevenuePage";
import ManagerDashboardExpensePage from "../pages/manager/dashboard/ExpensePage";
import ManagerDashboardFeedbackPage from "../pages/manager/dashboard/FeedbackPage";
import ManagerTableHistoriesPage from "../pages/manager/active/TableHistoriesPage";
import ManagerUseTablesPage from "../pages/manager/active/UseTablesPage";
import ManagerUseFoodsPage from "../pages/manager/active/UseFoodsPage";
import ManagerMenusPage from "../pages/manager/active/MenusPage";
import ManagerOrderSheetsPage from "../pages/manager/active/OrderSheetsPage";
import ManagerMessagesPage from "../pages/manager/active/MessagesPage";
import ManagerBillsPage from "../pages/manager/active/BillsPage";
import ManagerReservationsPage from "../pages/manager/active/ReservationsPage";
import ManagerFloorsPage from "../pages/manager/table/FloorsPage";
import ManagerCategoryTablesPage from "../pages/manager/table/CategoryTablesPage";
import ManagerTablesPage from "../pages/manager/table/TablesPage";
import ManagerInputTicketsPage from "../pages/manager/food/InputTicketsPage";
import ManagerSuppliersPage from "../pages/manager/food/SuppliersPage";
import ManagerCategoryIngredientsPage from "../pages/manager/food/CategoryIngredientsPage";
import ManagerIngredientsPage from "../pages/manager/food/IngredientsPage";
import ManagerCategoryFoodsPage from "../pages/manager/food/CategoryFoodsPage";
import ManagerFoodsPage from "../pages/manager/food/FoodsPage";
import ManagerRolesPage from "../pages/manager/employee/RolesPage";
import ManagerPermissionsPage from "../pages/manager/employee/PermissionsPage";
import ManagerEmployeesPage from "../pages/manager/employee/EmployeesPage";
import FunctionApiService from "../services/api/v1/FunctionApiService";
import RequireAuth from "../services/requiredAuth";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import type { RouteObject } from "react-router-dom";
import type { AdminManagerPageProps } from "../constants/props";
import type { ManagerDetailResponseType } from "../types/ManagerType";
import type { EmployeeDetailResponseType } from "../types/EmployeeType";
import type { CustomerDetailResponseType } from "../types/CustomerType";

type ManagerEmployeeRouterProps = {
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  infoLogin: ManagerDetailResponseType | EmployeeDetailResponseType;
};

// Hàm trả về page component tương ứng với chức năng
const pageComponentMap: Record<
  string,
  React.ComponentType<{
    infoLogin: ManagerDetailResponseType | EmployeeDetailResponseType;
    functionId: number;
    nameVN: string;
    nameEN: string;
  }>
> = {
  "dashboard-profit": ManagerDashboardProfitPage,
  "dashboard-revenue": ManagerDashboardRevenuePage,
  "dashboard-expense": ManagerDashboardExpensePage,
  "dashboard-feedback": ManagerDashboardFeedbackPage,
  "table-histories": ManagerTableHistoriesPage,
  "use-tables": ManagerUseTablesPage,
  "use-foods": ManagerUseFoodsPage,
  menus: ManagerMenusPage,
  "order-sheets": ManagerOrderSheetsPage,
  messages: ManagerMessagesPage,
  bills: ManagerBillsPage,
  reservations: ManagerReservationsPage,
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
  permissions: ManagerPermissionsPage,
  employees: ManagerEmployeesPage,
};
const getPageByFunctionNameEN = ({
  isManager,
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}: AdminManagerPageProps): JSX.Element | null => {
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id"),
  );
  if (isManager && selectedRestaurantId === 0) {
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
const getRestaurantInfoRouteForManager = ({
  isManager,
  infoLogin,
}: {
  isManager: boolean;
  infoLogin?:
    | ManagerDetailResponseType
    | EmployeeDetailResponseType
    | CustomerDetailResponseType;
}) => {
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id"),
  );

  console.log(selectedRestaurantId);

  const paths = ["summary", "restaurant", "chatbot"];
  if (isManager && selectedRestaurantId === 0) {
    return [
      ...paths.map((path) => ({
        path,
        element: <Navigate to="/manager" replace />,
      })),
    ];
  }

  if (isManager) {
    return [
      { path: "summary", element: <ManagerSummaryPage /> },
      {
        path: "restaurant",
        element: (
          <ManagerRestaurantPage
            infoLogin={infoLogin!}
            functionId={0}
            nameVN="Thông tin nhà hàng"
            nameEN="restaurant"
          />
        ),
      },
      {
        path: "chatbot",
        element: (
          <ManagerChatbotPage
            infoLogin={infoLogin!}
            functionId={0}
            nameVN="Chatbot hỗ trợ"
            nameEN="chatbot"
          />
        ),
      },
    ];
  }

  return [];
};

const ManagerEmployeeRouter = async ({
  isAdmin,
  isManager,
  isEmployee,
  infoLogin,
}: ManagerEmployeeRouterProps): Promise<RouteObject> => {
  // Danh sách chức năng
  const responseFunction = await FunctionApiService.getAll();
  if (responseFunction?.status !== 200) {
    console.error("Truy vấn dữ liệu thất bại");
    return {};
  }
  const functions = responseFunction.data;

  return {
    path: isManager ? "/manager" : "/employee",
    element: (
      <AdminManagerLayout
        isAdmin={isAdmin}
        isManager={isManager}
        isEmployee={isEmployee}
      />
    ),
    errorElement: <OtherErrorPage />,
    id: "manager-info-login",
    loader: () => {
      return {
        infoLogin: infoLogin,
        functions: functions,
      };
    },
    children: [
      ...getRestaurantInfoRouteForManager({ isManager }),
      ...(functions?.map((func) => ({
        path: func.nameEN,
        element: isManager ? (
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
  };
};

export default ManagerEmployeeRouter;
