import useModal from "../../hooks/useModal";
import ModalComponent from "../ModalComponent";
import ChangeInfoModalComponent from "../admin-manager/modal/header-menu/ChangeInfoModalComponent";
import ChangePasswordUserModalComponent from "../admin-manager/modal/header-menu/ChangePasswordUserModalComponent";
import AuthApiService from "../../services/api/v1/AuthApiService";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Dropdown, Layout, Select } from "antd";
import { UserPen, Settings, Power, Lock, Languages } from "lucide-react";
import {
  ImageSourcePath,
  ModalWidthValue,
  UserRoleValue,
} from "../../constants/values";
import { openNotification } from "../../utils/showNotification";
import { openConfirmation } from "../../utils/showConfirmation";
import type { MenuProps } from "antd";
import type { UserDetailResponseType } from "../../types/UserType";
import type { ManagerDetailResponseType } from "../../types/ManagerType";
import type { EmployeeDetailResponseType } from "../../types/EmployeeType";

type AdminManagerHeaderComponentProps = {
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  infoLogin:
    | UserDetailResponseType
    | ManagerDetailResponseType
    | EmployeeDetailResponseType;
  selectedSubmenu: string;
};

const AdminManagerHeaderComponent: React.FC<
  AdminManagerHeaderComponentProps
> = ({ isAdmin, isManager, isEmployee, infoLogin, selectedSubmenu }) => {
  // Biến để chuyển trang
  const navigate = useNavigate();

  // Language
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<string>(
    localStorage.getItem("lang") || "vi",
  );
  const changeLanguage = (key: string) => {
    setLang(key);
  };
  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
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
        setTimeout(() => navigate("/login"), 1500);
      } else {
        openNotification({
          type: "error",
          message: "Thất bại",
          description: res!.data ? String(res!.data) : "Đăng xuất thất bại",
        });
      }
    }
  };

  //  Menu
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
              ).image
                ? (
                    infoLogin as
                      | ManagerDetailResponseType
                      | EmployeeDetailResponseType
                  ).image
                : ImageSourcePath + "no-image.png"
            }
            className="avatar"
          />
          {isEmployee && (
            <div className="info">
              <b>{(infoLogin as EmployeeDetailResponseType).user.username}</b>
              <span>
                {(infoLogin as EmployeeDetailResponseType).user.role ===
                UserRoleValue.employee
                  ? (infoLogin as EmployeeDetailResponseType).role.name
                  : (infoLogin as EmployeeDetailResponseType).user.role}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: !isManager ? "change-info" : "",
      label: !isManager ? "Chỉnh sửa thông tin" : "",
      icon: !isManager ? <UserPen /> : undefined,
      onClick: () =>
        openModal({
          title: "Chỉnh sửa thông tin",
          width: ModalWidthValue.split2,
          className: "default change-info",
          children: ManagerHeaderMenuModals.changeInfo(
            infoLogin as EmployeeDetailResponseType,
          ),
        }),
    },
    {
      key: !isManager ? "change-password" : "",
      label: !isManager ? "Thay đổi mật khẩu" : "",
      icon: !isManager ? <Lock /> : undefined,
      onClick: () =>
        openModal({
          title: "Thay đổi mật khẩu",
          width: ModalWidthValue.split1,
          className: "default change-password",
          children: ManagerHeaderMenuModals.changePassword(
            (infoLogin as EmployeeDetailResponseType).user.id,
          ),
        }),
    },
    {
      key: "public",
      label: <NavLink to="/public">Trang khách hàng</NavLink>,
      icon: <Settings />,
    },
    {
      key: "logout",
      label: (
        <Button type="primary" className="logout">
          <Power />
          <span>{t("logout")}</span>
        </Button>
      ),
      onClick: handleLogout,
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerHeaderMenuModals = {
    changeInfo: (employee: EmployeeDetailResponseType) => (
      <ChangeInfoModalComponent
        objectEN="employees"
        data={employee}
        closeModal={closeModal}
      />
    ),
    changePassword: (userId: number) => (
      <ChangePasswordUserModalComponent
        objectEN="employees"
        fieldId={userId}
        closeModal={closeModal}
      />
    ),
  };

  return (
    <>
      <Layout.Header className="admin-manager-header flex items-center justify-between px-4">
        <h2 className="admin-manager-header__title">{selectedSubmenu}</h2>
        <div className="admin-manager-header__actions">
          <Select
            suffixIcon={<Languages />}
            defaultValue="vi"
            options={[
              {
                label: "🇻🇳 Tiếng Việt",
                value: "vi",
              },
              {
                label: "🇬🇧 English",
                value: "en",
              },
            ]}
            className="change-language"
            onChange={(val) => changeLanguage(val)}
          ></Select>
          {/* <div className="change-theme">
              <Switch
                checkedChildren="🌞"
                unCheckedChildren="🌙"
                style={{ backgroundColor: "#fff" }}
              />
            </div> */}
          {!isAdmin ? (
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Avatar
                src={
                  (infoLogin as EmployeeDetailResponseType).image
                    ? (infoLogin as EmployeeDetailResponseType).image
                    : ImageSourcePath + "no-image.png"
                }
                alt="user-avatar"
                className="avatar"
              />
            </Dropdown>
          ) : (
            <>
              <Button
                variant="solid"
                color="primary"
                style={{ padding: "10px", fontSize: 18 }}
                onClick={() => navigate("/public")}
              >
                <Settings />
              </Button>
              <Button
                variant="solid"
                color="primary"
                style={{ padding: "10px", fontSize: 18 }}
                onClick={handleLogout}
              >
                <Power />
              </Button>
            </>
          )}
        </div>
      </Layout.Header>
      {modal.open && (
        <ModalComponent
          title={modal.title}
          open={modal.open}
          width={modal.width}
          className={modal.className}
          children={modal.children}
          setCloseModal={() => closeModal()}
        />
      )}
    </>
  );
};

export default AdminManagerHeaderComponent;
