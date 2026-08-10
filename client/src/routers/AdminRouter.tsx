import AdminManagerLayout from "../layouts/AdminManagerLayout";
import AdminCustomersPage from "../pages/admin/CustomersPage";
import AdminManagersPage from "../pages/admin/ManagersPage";
import AdminRestaurantsPage from "../pages/admin/RestaurantsPage";
import OtherErrorPage from "../pages/other/ErrorPage";
import type { UserDetailResponseType } from "../types/UserType";

type AdminRouterProps = {
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  infoLogin: UserDetailResponseType;
};

const AdminRouter = ({
  isAdmin,
  isManager,
  isEmployee,
  infoLogin,
}: AdminRouterProps) => {
  return {
    path: "/admin",
    element: (
      <AdminManagerLayout
        isAdmin={isAdmin}
        isManager={isManager}
        isEmployee={isEmployee}
      />
    ),
    errorElement: <OtherErrorPage />,
    id: "admin-info-login",
    loader: () => {
      return {
        infoLogin: infoLogin,
      };
    },
    children: [
      {
        path: "restaurants",
        element: (
          <AdminRestaurantsPage
            adminLogin={infoLogin}
            functionId={0}
            nameVN="Nhà hàng"
            nameEN="restaurants"
          />
        ),
      },
      {
        path: "managers",
        element: (
          <AdminManagersPage
            adminLogin={infoLogin}
            functionId={0}
            nameVN="Chủ nhà hàng"
            nameEN="managers"
          />
        ),
      },
      {
        path: "customers",
        element: (
          <AdminCustomersPage
            adminLogin={infoLogin}
            functionId={0}
            nameVN="Khách hàng"
            nameEN="customers"
          />
        ),
      },
    ],
  };
};

export default AdminRouter;
