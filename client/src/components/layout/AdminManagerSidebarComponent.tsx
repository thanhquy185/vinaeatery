import { NavLink } from "react-router-dom";
import { Menu } from "antd";
import {
  Building,
  UserStar,
  Users,
  ChartNoAxesCombined,
  MonitorCog,
  Columns3Cog,
  ChefHat,
  IdCardLanyard,
  MoveLeft,
  Layers,
  Info,
  BotMessageSquare,
} from "lucide-react";
import { UserRoleValue } from "../../constants/values";
import { getFunctionIdsString } from "../../services/managerLogin";
import type { Dispatch, SetStateAction } from "react";
import type { MenuProps } from "antd";
import type { FunctionDetailResponseType } from "../../types/FunctionType";
import type { UserDetailResponseType } from "../../types/UserType";
import type { ManagerDetailResponseType } from "../../types/ManagerType";
import type { EmployeeDetailResponseType } from "../../types/EmployeeType";

// Hàm lấy ra danh sách các chức năng mà nhân viên có thể thực hiện
const getValidFunctions = ({
  infoLogin,
  functions,
  functionCategory,
  functionIdsEmployee,
}: {
  infoLogin: EmployeeDetailResponseType;
  functions: FunctionDetailResponseType[];
  functionCategory: string;
  functionIdsEmployee: string;
}) => {
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  const isEmployee = infoLogin?.user?.role === UserRoleValue.employee;

  return functions
    ?.filter(
      (func: FunctionDetailResponseType) =>
        (isManager || isEmployee) &&
        func.category === functionCategory &&
        functionIdsEmployee
          .split("|")
          .some((functionId) => functionId === String(func.id)),
    )
    .map((func: FunctionDetailResponseType) => ({
      key: func.nameEN,
      label: (
        <NavLink to={`/${isManager ? "manager" : "employee"}/${func.nameEN}`}>
          {func.nameVN}
        </NavLink>
      ),
    }));
};

type AdminManagerSidebarComponentProps = {
  isAdmin: boolean;
  isManager: boolean;
  infoLoginRouteLoaderData: any;
  selectedRestaurant: number;
  setSelectedRestaurant: Dispatch<SetStateAction<number>>;
  setSelectedSubmenu: Dispatch<SetStateAction<string>>;
};

const AdminManagerSidebarComponent: React.FC<
  AdminManagerSidebarComponentProps
> = ({
  isAdmin,
  isManager,
  infoLoginRouteLoaderData,
  selectedRestaurant,
  setSelectedRestaurant,
  setSelectedSubmenu,
}) => {
  // Dữ liệu được load ban đầu
  const functions: FunctionDetailResponseType[] = infoLoginRouteLoaderData
    ? infoLoginRouteLoaderData.functions
    : null;
  const infoLogin:
    | UserDetailResponseType
    | ManagerDetailResponseType
    | EmployeeDetailResponseType = infoLoginRouteLoaderData
    ? infoLoginRouteLoaderData.infoLogin
    : null;
  const functionIdsEmployee: string | null | undefined =
    infoLoginRouteLoaderData
      ? getFunctionIdsString({
          currentEmployeeLogin: infoLogin as EmployeeDetailResponseType,
        })
      : null;

  // Các chức năng theo từng mục của quản lý
  const managerDashboardItems = getValidFunctions({
    infoLogin: infoLogin as EmployeeDetailResponseType,
    functions,
    functionCategory: "dashboard",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });
  const managerActiveManagerItems = getValidFunctions({
    infoLogin: infoLogin as EmployeeDetailResponseType,
    functions,
    functionCategory: "active",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });
  const managerSeatManagerItems = getValidFunctions({
    infoLogin: infoLogin as EmployeeDetailResponseType,
    functions,
    functionCategory: "seat",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });
  const managerFoodManagerItems = getValidFunctions({
    infoLogin: infoLogin as EmployeeDetailResponseType,
    functions,
    functionCategory: "food",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });
  const managerEmployeeManagerItems = getValidFunctions({
    infoLogin: infoLogin as EmployeeDetailResponseType,
    functions,
    functionCategory: "employee",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });

  return (
    <Menu
      mode="inline"
      theme="light"
      items={
        [
          isAdmin && {
            key: "restaurants",
            icon: <Building />,
            label: <NavLink to={`/admin/restaurants`}>Nhà hàng</NavLink>,
          },
          isAdmin && {
            key: "managers",
            icon: <UserStar />,
            label: <NavLink to={`/admin/managers`}>Chủ nhà hàng</NavLink>,
          },
          isAdmin && {
            key: "customers",
            icon: <Users />,
            label: <NavLink to={`/admin/customers`}>Khách hàng</NavLink>,
          },
          isManager &&
            selectedRestaurant && {
              key: "summary",
              icon: <Layers />,
              label: (
                <NavLink to={`/manager/summary`}>Tổng quan nhà hàng</NavLink>
              ),
            },
          isManager &&
            selectedRestaurant && {
              key: "restaurant",
              icon: <Info />,
              label: (
                <NavLink to={`/manager/restaurant`}>Thông tin nhà hàng</NavLink>
              ),
            },
          isManager &&
            selectedRestaurant && {
              key: "chatbot",
              icon: <BotMessageSquare />,
              label: <NavLink to={`/manager/chatbot`}>Chatbot hỗ trợ</NavLink>,
            },
          !isAdmin &&
            managerDashboardItems?.length! > 0 && {
              key: "dashboard",
              icon: <ChartNoAxesCombined />,
              label: "Thống kê",
              children: managerDashboardItems,
            },
          !isAdmin &&
            managerActiveManagerItems?.length! > 0 && {
              key: "active",
              icon: <MonitorCog />,
              label: "Quản lý vận hành",
              children: managerActiveManagerItems,
            },
          !isAdmin &&
            managerSeatManagerItems?.length! > 0 && {
              key: "seat",
              icon: <Columns3Cog />,
              label: "Quản lý hạ tầng",
              children: managerSeatManagerItems,
            },
          !isAdmin &&
            managerFoodManagerItems?.length! > 0 && {
              key: "food",
              icon: <ChefHat />,
              label: "Quản lý kho hàng",
              children: managerFoodManagerItems,
            },
          !isAdmin &&
            managerEmployeeManagerItems?.length! > 0 && {
              key: "employee",
              icon: <IdCardLanyard />,
              label: "Quản lý nhân sự",
              children: managerEmployeeManagerItems,
            },
          isManager && {
            key: "",
            icon: <MoveLeft />,
            label: (
              <NavLink to={`/manager`} onClick={() => setSelectedRestaurant(0)}>
                Chọn nhà hàng khác
              </NavLink>
            ),
          },
        ].filter(Boolean) as MenuProps["items"]
      }
      onSelect={(e) => {
        if (
          (!e.keyPath[1] && e.key === "restaurants") ||
          (!e.keyPath[1] && e.key === "managers") ||
          (!e.keyPath[1] && e.key === "customers") ||
          (!e.keyPath[1] && e.key === "users")
        ) {
          setSelectedSubmenu("Quản trị hệ thống");
        } else if (e.keyPath[1] === "summary") {
          setSelectedSubmenu("Tổng quan");
        } else if (e.keyPath[1] === "restaurant") {
          setSelectedSubmenu("Thông tin");
        } else if (e.keyPath[1] === "dashboard") {
          setSelectedSubmenu("Thống kê");
        } else if (e.keyPath[1] === "active") {
          setSelectedSubmenu("Vận hành quán ăn");
        } else if (e.keyPath[1] === "seat") {
          setSelectedSubmenu("Quản lý chỗ ngồi");
        } else if (e.keyPath[1] === "food") {
          setSelectedSubmenu("Quản lý món ăn");
        } else if (e.keyPath[1] === "employee") {
          setSelectedSubmenu("Quản lý nhân sự");
        }
      }}
    />
  );
};

export default AdminManagerSidebarComponent;
