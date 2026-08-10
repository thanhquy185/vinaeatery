import OtherLoginPage from "../pages/public/LoginPage";
import PaymentMachinePage from "../pages/other/PaymentMachinePage";
import OtherErrorPage from "../pages/other/ErrorPage";
import OtherUnauthorizedPage from "../pages/other/UnauthorizedPage";
import type { RouteObject } from "react-router-dom";

type DefaultRouterProps = {};

const DefaultRouter = ({}: DefaultRouterProps): RouteObject => {
  return {
    path: "/",
    children: [
      {
        path: "*",
        element: <OtherErrorPage />,
      },
      {
        path: "/login",
        element: <OtherLoginPage />,
      },
      {
        path: "/payment",
        element: <PaymentMachinePage />,
      },
      {
        path: "/error",
        element: <OtherErrorPage />,
      },
      {
        path: "/unauthorized",
        element: <OtherUnauthorizedPage />,
      },
    ],
  };
};

export default DefaultRouter;
