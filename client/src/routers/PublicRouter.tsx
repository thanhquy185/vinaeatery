import OtherErrorPage from "../pages/other/ErrorPage";
import PublicLayout from "../layouts/PublicLayout";
import PublicHomePage from "../pages/public/HomePage";
import PublicRestaurantsPage from "../pages/public/RestaurantsPage";
import PublicProfilePage from "../pages/public/ProfilePage";
// import PublicOrdersPage from "../pages/public/orders";
import PublicReservationsPage from "../pages/public/ReservationsPage";
import PublicChangePasswordPage from "../pages/public/ChangePasswordPage";
import type { RouteObject } from "react-router-dom";
import type { ManagerDetailResponseType } from "../types/ManagerType";
import type { EmployeeDetailResponseType } from "../types/EmployeeType";
import type { CustomerDetailResponseType } from "../types/CustomerType";
import type { UserDetailResponseType } from "../types/UserType";

type PublicRouterProps = {
  isCustomer: boolean;
  infoLogin:
    | UserDetailResponseType
    | ManagerDetailResponseType
    | EmployeeDetailResponseType
    | CustomerDetailResponseType;
};

const PublicRouter = ({
  isCustomer,
  infoLogin,
}: PublicRouterProps): RouteObject => {
  return {
    path: "/public",
    element: <PublicLayout />,
    errorElement: <OtherErrorPage />,
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
        element: (
          <PublicRestaurantsPage
            isCustomer={isCustomer}
            customerLogin={infoLogin as CustomerDetailResponseType}
          />
        ),
      },
      {
        path: "profile",
        element: <PublicProfilePage />,
      },
      {
        path: "reservations",
        element: (
          <PublicReservationsPage
            isCustomer={isCustomer}
            customerLogin={infoLogin as CustomerDetailResponseType}
          />
        ),
      },
      // {
      //   path: "orders",
      //   element: <PublicOrdersPage />,
      // },
      {
        path: "change-password",
        element: <PublicChangePasswordPage />,
      },
    ],
  };
};

export default PublicRouter;
