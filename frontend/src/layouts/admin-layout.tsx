import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import {
  Layout,
  Menu,
  type MenuProps,
  Dropdown,
  Avatar,
  Select,
  Button,
} from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faPlayCircle,
  faPeopleGroup,
  faTableCells,
  faCubesStacked,
  faUsersGear,
  faUserPen,
  faCalendarDays,
  faFileInvoiceDollar,
  faFileSignature,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import type { FunctionsType } from "../common/types";
import CustomBrand from "../components/common/brand";
import { HandleLogout } from "../services/api";
import { getFunctionIdsString } from "../services/employee-login";
import { openNotification } from "../utils/showNotification";
import { openConfirmation } from "../utils/showConfirmation";
import { useTranslation } from "react-i18next";

const { Header, Sider } = Layout;

// Hàm lấy ra danh sách các chức năng mà nhân viên có thể thực hiện
const getValidFunctions = ({
  functions,
  functionCategory,
  functionIdsEmployee,
}: {
  functions: FunctionsType[];
  functionCategory: string;
  functionIdsEmployee: string;
}) => {
  return functions
    ?.filter(
      (func: FunctionsType) =>
        func.category === functionCategory &&
        functionIdsEmployee
          .split("|")
          .some((functionId) => functionId === String(func.id))
    )
    .map((func: FunctionsType) => ({
      key: func.nameEN,
      label: <NavLink to={`/admin/${func.nameEN}`}>{func.nameVN}</NavLink>,
    }));
};

// Admin Sidebar
const AdminSidebar = ({
  setSelectedSubmenu,
}: {
  setSelectedSubmenu: Dispatch<SetStateAction<string>>;
}) => {
  // Dữ liệu được load ban đầu
  const functions = useRouteLoaderData("admin")!.functions;
  const employeeLogin = useRouteLoaderData("admin")!.employeeLogin;
  const functionIdsEmployee = getFunctionIdsString({
    currentEmployeeLogin: employeeLogin,
  });

  // Các chức năng theo từng mục
  const dashboardItems = getValidFunctions({
    functions,
    functionCategory: "dashboard",
    functionIdsEmployee: functionIdsEmployee!,
  });
  const activeManagerItems = getValidFunctions({
    functions,
    functionCategory: "active",
    functionIdsEmployee: functionIdsEmployee!,
  });
  const customerManagerItems = getValidFunctions({
    functions,
    functionCategory: "customer",
    functionIdsEmployee: functionIdsEmployee!,
  });
  const seatManagerItems = getValidFunctions({
    functions,
    functionCategory: "seat",
    functionIdsEmployee: functionIdsEmployee!,
  });
  const foodManagerItems = getValidFunctions({
    functions,
    functionCategory: "food",
    functionIdsEmployee: functionIdsEmployee!,
  });
  const employeeManagerItems = getValidFunctions({
    functions,
    functionCategory: "employee",
    functionIdsEmployee: functionIdsEmployee!,
  });

  return (
    <Menu
      mode="inline"
      theme="light"
      items={[
        // {
        //   key: "interact-customer",
        //   icon: <FontAwesomeIcon icon={faHeadset} />,
        //   label: <NavLink to="interact-customer">Tương tác khách hàng</NavLink>,
        // },
        dashboardItems.length > 0 && {
          key: "dashboard",
          icon: <FontAwesomeIcon icon={faChartSimple} />,
          label: "Thống kê",
          children: dashboardItems,
        },
        activeManagerItems.length > 0 && {
          key: "active",
          icon: <FontAwesomeIcon icon={faPlayCircle} />,
          label: "Vận hành quán ăn",
          children: activeManagerItems,
        },
        customerManagerItems.length > 0 && {
          key: "customer",
          icon: <FontAwesomeIcon icon={faPeopleGroup} />,
          label: "Quản lý khách hàng",
          children: customerManagerItems,
        },
        seatManagerItems.length > 0 && {
          key: "seat",
          icon: <FontAwesomeIcon icon={faTableCells} />,
          label: "Quản lý chỗ ngồi",
          children: seatManagerItems,
        },
        foodManagerItems.length > 0 && {
          key: "food",
          icon: <FontAwesomeIcon icon={faCubesStacked} />,
          label: "Quản lý món ăn",
          children: foodManagerItems,
        },
        employeeManagerItems.length > 0 && {
          key: "employee",
          icon: <FontAwesomeIcon icon={faUsersGear} />,
          label: "Quản lý nhân sự",
          children: employeeManagerItems,
        },
      ].filter(Boolean)}
      onSelect={(e) => {
        if (e.keyPath[1] === "dashboard") {
          setSelectedSubmenu("Thống kê");
        } else if (e.keyPath[1] === "active") {
          setSelectedSubmenu("Vận hành quán ăn");
        } else if (e.keyPath[1] === "customer") {
          setSelectedSubmenu("Quản lý khách hàng");
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

// Admin Header
const AdminHeader = ({ selectedSubmenu }: { selectedSubmenu: string }) => {
  //
  const navigate = useNavigate();
  //
  const employeeLogin = useRouteLoaderData("admin")!.employeeLogin;

  // Language
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<string>(
    localStorage.getItem("lang") || "vi"
  );
  const changeLanguage = (key: string) => {
    setLang(key);
  };
  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      type: "group",
      label: (
        <div className="user-login">
          <Avatar
            src={
              employeeLogin?.image
                ? "/src/assets/images/employees/" + employeeLogin.image
                : "/src/assets/images/others/no-image.png"
            }
            className="avatar"
          />
          <div className="info">
            <b>{employeeLogin?.fullname}</b>
            <span>{employeeLogin?.currentRole?.name}</span>
          </div>
        </div>
      ),
    },
    {
      key: "profile",
      label: "Chỉnh sửa thông tin",
      icon: <FontAwesomeIcon icon={faUserPen} />,
    },
    {
      key: "schedule",
      label: "Lịch làm việc",
      icon: <FontAwesomeIcon icon={faCalendarDays} />,
    },
    {
      key: "salary",
      label: "Bảng lương",
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
    },
    {
      key: "leave",
      label: "Đơn nghỉ phép",
      icon: <FontAwesomeIcon icon={faFileSignature} />,
    },
    {
      key: "logout",
      label: (
        <Button type="primary" className="logout">
          <FontAwesomeIcon icon={faPowerOff} />
          <span>{t("logout")}</span>
        </Button>
      ),
      onClick: async () => {
        const answer = await openConfirmation({
          title: `Bạn có chắc chắn đăng xuất ?`,
          content: "Hành động này không thể hoàn tác.",
        });
        if (answer) {
          const res = await HandleLogout();
          if (res!.status === 200) {
            openNotification({
              type: "success",
              message: "Thành công",
              description: "Đăng xuất thành công",
              duration: 1.5,
            });
            setTimeout(() => navigate("/login"), 1500);
          } else {
            openNotification({
              type: "error",
              message: "Thất bại",
              description: res!.data ? String(res!.data) : "Đăng xuất thất bại",
              duration: 1.5,
            });
          }
        }
      },
    },
  ];

  return (
    <Header className="header flex items-center justify-between px-4">
      <h2 className="header__title">{selectedSubmenu}</h2>
      {employeeLogin?.id && (
        <div className="header__actions">
          <Select
            suffixIcon={<GlobalOutlined />}
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
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar
              src={
                employeeLogin!.image
                  ? "/src/assets/images/employees/" + employeeLogin!.image
                  : "/src/assets/images/others/no-image.png"
              }
              alt="user-avatar"
              className="avatar"
            />
          </Dropdown>
        </div>
      )}
    </Header>
  );
};

// Admin Layout
const AdminLayout = () => {
  // Collapsed State
  const [collapsed, setCollapsed] = useState<boolean>(false);
  // Submenu Selected State
  const [selectedSubmenu, setSelectedSubmenu] = useState<string>("");

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="sidebar"
      >
        <CustomBrand to="#!" prefixClassName="sidebar__" name="VINAEATERY" />
        <AdminSidebar setSelectedSubmenu={setSelectedSubmenu} />
      </Sider>
      <Layout style={{ backgroundColor: "transparent" }}>
        <AdminHeader selectedSubmenu={selectedSubmenu} />
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
