import AuthModalComponent from "../public/AuthModalComponent";
import AuthApiService from "../../services/api/v1/AuthApiService";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Avatar, Dropdown, Button } from "antd";
import {
  Bolt,
  Building,
  ConciergeBell,
  Home,
  LockKeyhole,
  LogIn,
  LogOut,
  Receipt,
  User,
  UserCircle,
} from "lucide-react";
import { ImageSourcePath, UserRoleValue } from "../../constants/values";
import { openConfirmation } from "../../utils/showConfirmation";
import { openNotification } from "../../utils/showNotification";
import type { ReactNode } from "react";
import type { MenuProps } from "antd";
import type { UserDetailResponseType } from "../../types/UserType";
import type { ManagerDetailResponseType } from "../../types/ManagerType";
import type { EmployeeDetailResponseType } from "../../types/EmployeeType";
import type { CustomerDetailResponseType } from "../../types/CustomerType";

interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

type PublicHeaderComponentProps = {
  infoLogin:
    | UserDetailResponseType
    | ManagerDetailResponseType
    | EmployeeDetailResponseType
    | CustomerDetailResponseType;
};

const PublicHeaderComponent: React.FC<PublicHeaderComponentProps> = ({
  infoLogin,
}) => {
  const location = useLocation();

  // Các biến kiểm tra quyền người dùng hiện tại
  const isAuthenticated = Boolean(infoLogin && infoLogin.id);
  const isAdmin =
    infoLogin &&
    (infoLogin as UserDetailResponseType).role === UserRoleValue.admin;
  const isManager =
    infoLogin &&
    (infoLogin as ManagerDetailResponseType | EmployeeDetailResponseType).user
      .role === UserRoleValue.manager;
  const isCustomer =
    infoLogin &&
    (infoLogin as CustomerDetailResponseType).user.role ==
      UserRoleValue.customer;

  //
  const navItems: NavItem[] = [
    { name: "Trang chủ", path: "/public", icon: <Home /> },
    { name: "Nhà hàng", path: "/public/restaurant", icon: <Building /> },
  ];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"login" | "signup">("login");
  const showAuthModal = (type: "login" | "signup") => {
    setModalType(type);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const activePath = location.pathname;
  const isNavItemActive = (path: string) => activePath === path;

  const UserMenu = () => {
    //
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const menuItems: MenuProps["items"] = [
      {
        key: "user-info",
        type: "group",
        label: (
          <div className="user-login">
            <Avatar
              src={
                (
                  infoLogin as
                    | ManagerDetailResponseType
                    | EmployeeDetailResponseType
                    | CustomerDetailResponseType
                ).image
                  ? (
                      infoLogin as
                        | ManagerDetailResponseType
                        | EmployeeDetailResponseType
                        | CustomerDetailResponseType
                    ).image
                  : ImageSourcePath + "no-image.png"
              }
              className="avatar"
            />
            <div className="info">
              <b>
                {isAdmin
                  ? (infoLogin as UserDetailResponseType).username
                  : (
                      infoLogin as
                        | ManagerDetailResponseType
                        | EmployeeDetailResponseType
                        | CustomerDetailResponseType
                    ).user.username}
              </b>
              <span>
                {isAdmin
                  ? (infoLogin as UserDetailResponseType).role
                  : (
                      infoLogin as
                        | ManagerDetailResponseType
                        | EmployeeDetailResponseType
                        | CustomerDetailResponseType
                    ).user.role}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: `${
          isCustomer
            ? ""
            : isAdmin
              ? "admin"
              : isManager
                ? "manager"
                : "employee"
        }`,
        label: (
          <NavLink
            to={
              isCustomer
                ? ""
                : isAdmin
                  ? "/admin"
                  : isManager
                    ? "/manager"
                    : "/employee"
            }
          >
            {isCustomer
              ? ""
              : isAdmin
                ? "Trang quản trị hệ thống"
                : "Trang quản lý nhà hàng"}
          </NavLink>
        ),
        icon: isCustomer ? undefined : <Bolt />,
      },
      {
        key: !isAdmin ? "profile" : "",
        label: !isAdmin ? (
          <NavLink to="/public/profile">Thông tin người dùng</NavLink>
        ) : (
          ""
        ),
        icon: !isAdmin ? <User /> : undefined,
      },
      {
        key: isCustomer ? "reservations" : "",
        label: isCustomer ? (
          <NavLink to="/public/reservations">Lịch sử đặt bàn</NavLink>
        ) : (
          ""
        ),
        icon: isCustomer ? <ConciergeBell /> : undefined,
      },
      {
        key: isCustomer ? "orders" : "",
        label: isCustomer ? (
          <NavLink to="/public/orders">Hoá đơn nhà hàng</NavLink>
        ) : (
          ""
        ),
        icon: isCustomer ? <Receipt /> : undefined,
      },
      {
        key: !isAdmin ? "change-password" : "",
        label: !isAdmin ? (
          <NavLink to="/public/change-password">Thay đổi mật khẩu</NavLink>
        ) : (
          ""
        ),
        icon: !isAdmin ? <LockKeyhole /> : undefined,
      },
    ];

    return (
      <div className="relative flex align-center gap-4">
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            onClick={toggleDropdown}
            className="flex! items-center gap-2"
            style={{
              background: "transparent",
              padding: "0",
              border: "none",
              boxShadow: "none",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            <span className="text-3xl! text-base font-medium text-gray-600 hidden lg:inline-block">
              Xin chào,{" "}
              <b className="text-[#b91c1c]">
                {isAdmin
                  ? (infoLogin as UserDetailResponseType).username
                  : (
                      infoLogin as
                        | ManagerDetailResponseType
                        | EmployeeDetailResponseType
                        | CustomerDetailResponseType
                    ).user.username}
              </b>
            </span>
            <UserCircle />
          </Button>
        </Dropdown>
        <Button
          // type="primary"
          style={{
            background: "transparent",
            padding: "0",
            border: "none",
            boxShadow: "none",
            fontSize: 18,
            fontWeight: 600,
          }}
          onClick={async () => {
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn đăng xuất ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              const res = await AuthApiService.handleLogout();
              if (res!.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Đăng xuất thành công",
                });
                setTimeout(() => (window.location.href = "/public"), 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: res!.data
                    ? String(res!.data)
                    : "Đăng xuất thất bại",
                });
              }
            }
          }}
          aria-label="Đăng Xuất"
        >
          <LogOut className="w-10 h-10 inline-block" />
        </Button>
      </div>
    );
  };
  const AuthButtons = () => (
    <div className="flex items-center gap-5">
      <Button
        type="primary"
        style={{
          padding: "20px 24px",
          fontSize: 15,
          fontWeight: 600,
        }}
        onClick={() => showAuthModal("login")}
      >
        <LogIn className="w-8 h-8 mr-1 inline-block" />
        <span>Đăng Nhập</span>
      </Button>
      <Button
        style={{
          padding: "20px 24px",
          fontSize: 15,
          fontWeight: 600,
        }}
        onClick={() => showAuthModal("signup")}
      >
        Đăng Ký
      </Button>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-1000 bg-white/20 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto py-5!">
          <div className="h-20 flex items-center">
            <a
              href="/"
              className="flex items-center gap-4 text-5xl font-extrabold tracking-tight text-red-600 hover:text-red-700 transition"
            >
              <img
                src={ImageSourcePath + "brand-image.png"}
                alt=""
                style={{ width: 60, height: 60 }}
              />
              <strong className="text-red-700 font-bold">VINAEATERY</strong>
            </a>
            <nav className="hidden md:flex items-center gap-2 lg:gap-6 ml-40!">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.path);

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 text-base font-medium px-4! py-4! rounded-full transition ${
                      isActive
                        ? "bg-red-50! text-red-700! font-semibold"
                        : "text-gray-600 hover:bg-gray-50! hover:text-red-600!"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="text-3xl">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className={"ml-auto! border-l border-gray-200"}>
              {isAuthenticated ? <UserMenu /> : <AuthButtons />}
            </div>
          </div>
        </div>
      </header>
      <AuthModalComponent
        isOpen={isModalOpen}
        modalType={modalType}
        handleCancel={handleCancel}
        setModalType={setModalType}
      />
    </>
  );
};

export default PublicHeaderComponent;
