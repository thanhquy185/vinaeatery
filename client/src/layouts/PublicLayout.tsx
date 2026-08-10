import PublicHeaderComponent from "../components/layout/PublicHeaderComponent";
import PublicFooterComponent from "../components/layout/PublicFooterComponent";
import { useEffect } from "react";
import { Outlet, useRouteLoaderData } from "react-router-dom";
import type { CustomerDetailResponseType } from "../types/CustomerType";
import type { EmployeeDetailResponseType } from "../types/EmployeeType";
import type { ManagerDetailResponseType } from "../types/ManagerType";
import type { UserDetailResponseType } from "../types/UserType";

const PublicLayout: React.FC = () => {
  // Load dữ liệu khách hàng đang đăng nhập
  const infoLoginRouteLoaderData =
    useRouteLoaderData("public-info-login") || {};
  const infoLogin =
    (infoLoginRouteLoaderData.infoLogin as
      | UserDetailResponseType
      | ManagerDetailResponseType
      | EmployeeDetailResponseType
      | CustomerDetailResponseType) || undefined;

  useEffect(() => {
    // Đảm bảo CSS được import nếu cần
    import("../assets/styles/tailwind.css");
  }, []);

  return (
    <div className="min-h-screen flex flex-col public-layout bg-white">
      <PublicHeaderComponent infoLogin={infoLogin} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <PublicFooterComponent />
    </div>
  );
};

export default PublicLayout;
