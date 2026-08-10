import OAuth2RedirectHandler from "../components/OAuth2RedirectHandler";
import PublicLayout from "../layouts/PublicLayout";
import CallFoodLayout from "../layouts/CallFoodLayout";
import PublicHomePage from "../pages/public/HomePage";
import PublicRestaurantsPage from "../pages/public/RestaurantsPage";
import OtherLoginPage from "../pages/public/LoginPage";
import OtherErrorPage from "../pages/other/ErrorPage";
import type { RouteObject } from "react-router-dom";

type AllowRouterProps = {};

const AllowRouter = ({}: AllowRouterProps): RouteObject[] => {
  return [
    {
      path: "/",
      children: [
        {
          path: "*",
          element: <OtherErrorPage />,
        },
        {
          path: "/call-food/restaurant/:restaurantId/table/:tableId",
          element: <CallFoodLayout />,
        },
        {
          path: "",
          element: <PublicLayout />,
          children: [
            {
              path: "",
              element: <PublicHomePage />,
            },
          ],
        },
        {
          path: "/login",
          element: <OtherLoginPage />,
        },
        {
          path: "/oauth2/redirect",
          element: <OAuth2RedirectHandler />,
        },
      ],
    },
    {
      path: "/public",
      element: <PublicLayout />,
      errorElement: <OtherErrorPage />,
      children: [
        {
          path: "",
          element: <PublicHomePage />,
        },
        {
          path: "restaurant",
          element: (
            <PublicRestaurantsPage
              isCustomer={false}
              customerLogin={undefined}
            />
          ),
        },
      ],
    },
  ];
};

export default AllowRouter;
