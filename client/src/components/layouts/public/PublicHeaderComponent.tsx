import AuthModalComponent from "../../auth/AuthModalComponent";
import AuthApiService from "../../../services/api/v1/AuthApiService";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Avatar, Dropdown, Button } from "antd";
import {
  Bolt,
  Building,
  ConciergeBell,
  Home,
  Handshake,
  LogIn,
  LogOut,
  Receipt,
  User,
  UserCircle,
} from "lucide-react";
import { ImageSourcePath, UserRoleValue } from "../../../constants/values";
import { openConfirmation } from "../../../utils/showConfirmationUtil";
import { openNotification } from "../../../utils/showNotificationUtil";
import "./PublicHeaderComponent.css";
import type { ReactNode } from "react";
import type { MenuProps } from "antd";
import type { UserDetailResponseType } from "../../../types/UserType";
import type { ManagerDetailResponseType } from "../../../types/ManagerType";
import type { EmployeeDetailResponseType } from "../../../types/EmployeeType";
import type { CustomerDetailResponseType } from "../../../types/CustomerType";

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
    { name: "Đối tác", path: "/public/partner", icon: <Handshake /> },
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
          <NavLink to="/public/profile">Tài khoản của tôi</NavLink>
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
          <NavLink to="/public/orders">Hóa đơn bàn ăn</NavLink>
        ) : (
          ""
        ),
        icon: isCustomer ? <Receipt /> : undefined,
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
            <span className="ve-public-header__greeting hidden lg:inline-block">
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
    <div className="ve-public-header__auth-buttons">
      <Button
        type="primary"
        className="ve-public-header__login-button"
        onClick={() => showAuthModal("login")}
      >
        <LogIn className="ve-public-header__login-icon" />
        <span>Đăng nhập</span>
      </Button>
      <Button
        className="ve-public-header__signup-button"
        onClick={() => showAuthModal("signup")}
      >
        Đăng ký
      </Button>
    </div>
  );

  return (
    <>
      <header className="ve-public-header">
        <div className="ve-public-header__container">
          <div className="ve-public-header__inner">
            <Link
              to="/public"
              className="ve-public-header__brand"
            >
              <img
                src={ImageSourcePath + "brand-image.png"}
                alt=""
                className="ve-public-header__brand-image"
              />
              <strong className="ve-public-header__wordmark">VINAEATERY</strong>
            </Link>
            <nav className="ve-public-header__nav">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.path);

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`ve-public-header__nav-link ${
                      isActive
                        ? "is-active"
                        : ""
                    }`}
                  >
                    <span className="ve-public-header__nav-icon">{item.icon}</span>
                    <span className="ve-public-header__nav-label">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="ve-public-header__actions">
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
