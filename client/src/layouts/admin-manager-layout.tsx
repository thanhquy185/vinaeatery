import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "../../node_modules/react-i18next";
import {
  Layout,
  Menu,
  type MenuProps,
  Dropdown,
  Avatar,
  Select,
  Button,
  Card,
  Tag,
  List,
} from "antd";
import {
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  ProductOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Banknote,
  Building,
  CalendarDays,
  ChartNoAxesCombined,
  ChefHat,
  Columns3Cog,
  FilePenLine,
  IdCardLanyard,
  Lock,
  LogOut,
  MonitorCog,
  MoveLeft,
  MoveRight,
  Power,
  Settings,
  User,
  UserCog,
  UserPen,
  UserRoundCog,
  Users,
  UserStar,
} from "lucide-react";
import type { EmployeeType, FunctionType, UserType } from "../common/types";
import {
  CommonStatus,
  ImageSourcePath,
  ModalWidthValue,
  UserRoleValue,
} from "../common/values";
import CustomBrand from "../components/common/brand";
import { useModal } from "../hook/use-modal";
import { getFunctionIdsString } from "../services/manager-login";
import { HandleLogout } from "../requests/auth";
import {
  FindAllRestaurant,
  FindAllRestaurantByManagerId,
} from "../requests/restaurants";
import { openNotification } from "../utils/show-notification";
import { openConfirmation } from "../utils/show-confirmation";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import ManagerChangeInfo from "../components/admin-manager/modal/header-menu/manager-change-info";
import CustomModal from "../components/common/modal";
import ManagerChangePassword from "../components/admin-manager/modal/header-menu/manager-change-password";
import ManagerTimetable from "../components/admin-manager/modal/header-menu/manager-timetable";
import ManagerPermissionTicket from "../components/admin-manager/modal/header-menu/manager-permission-ticket";
import ManagerPayslip from "../components/admin-manager/modal/header-menu/manager-payslip";

const { Header, Sider } = Layout;

// Hàm lấy ra danh sách các chức năng mà nhân viên có thể thực hiện
const getValidFunctions = ({
  infoLogin,
  functions,
  functionCategory,
  functionIdsEmployee,
}: {
  infoLogin: EmployeeType;
  functions: FunctionType[];
  functionCategory: string;
  functionIdsEmployee: string;
}) => {
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  const isEmployee = infoLogin?.user?.role === UserRoleValue.employee;

  return functions
    ?.filter(
      (func: FunctionType) =>
        (isManager || isEmployee) &&
        func.category === functionCategory &&
        functionIdsEmployee
          .split("|")
          .some((functionId) => functionId === String(func.id)),
    )
    .map((func: FunctionType) => ({
      key: func.nameEN,
      label: (
        <NavLink to={`/${isManager ? "manager" : "employee"}/${func.nameEN}`}>
          {func.nameVN}
        </NavLink>
      ),
    }));
};

// Admin Manager Sidebar
const AdminManagerSidebar: FC<{
  infoLoginRouteLoaderData: any;
  selectedRestaurant: number;
  setSelectedRestaurant: Dispatch<SetStateAction<number>>;
  setSelectedSubmenu: Dispatch<SetStateAction<string>>;
}> = ({
  infoLoginRouteLoaderData,
  selectedRestaurant,
  setSelectedRestaurant,
  setSelectedSubmenu,
}) => {
  // Dữ liệu được load ban đầu
  const functions: FunctionType[] = infoLoginRouteLoaderData
    ? infoLoginRouteLoaderData.functions
    : null;
  const infoLogin: EmployeeType = infoLoginRouteLoaderData
    ? infoLoginRouteLoaderData.infoLogin
    : null;
  const functionIdsEmployee: string | null | undefined =
    infoLoginRouteLoaderData
      ? getFunctionIdsString({
          currentEmployeeLogin: infoLogin,
        })
      : null;

  //
  const isAdmin =
    infoLogin && (infoLogin as UserType)?.role === UserRoleValue.admin;
  const isManager =
    infoLogin && infoLogin?.user?.role === UserRoleValue.manager;

  // Các chức năng theo từng mục của quản lý
  const managerDashboardItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "dashboard",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });
  const managerActiveManagerItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "active",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });
  const managerSeatManagerItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "seat",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });
  const managerFoodManagerItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "food",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : (functionIdsEmployee ?? ""),
  });
  const managerEmployeeManagerItems = getValidFunctions({
    infoLogin,
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
      items={[
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
        isAdmin && {
          key: "users",
          icon: <UserCog />,
          label: <NavLink to={`/admin/users`}>Tài khoản</NavLink>,
        },
        isManager &&
          selectedRestaurant && {
            key: "restaurant-info",
            icon: <Building />,
            label: (
              <NavLink to={`/manager/restaurant-info`}>
                Thông tin nhà hàng
              </NavLink>
            ),
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
        //   managerCustomerManagerItems?.length! > 0 && {
        //     key: "customer",
        //     icon: <FontAwesomeIcon icon={faPeopleGroup} />,
        //     label: "Quản lý khách hàng",
        //     children: managerCustomerManagerItems,
        //   },
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
      ].filter(Boolean)}
      onSelect={(e) => {
        if (
          (!e.keyPath[1] && e.key === "restaurants") ||
          (!e.keyPath[1] && e.key === "managers") ||
          (!e.keyPath[1] && e.key === "customers") ||
          (!e.keyPath[1] && e.key === "users")
        ) {
          setSelectedSubmenu("Quản trị hệ thống");
        } else if (e.keyPath[1] === "restaurant-info") {
          setSelectedSubmenu("Thông tin nhà hàng");
        } else if (e.keyPath[1] === "dashboard") {
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

// Admin Manager Header
const AdminManagerHeader: FC<{
  infoLogin: any;
  selectedRestaurant: number;
  selectedSubmenu: string;
}> = ({ infoLogin, selectedRestaurant, selectedSubmenu }) => {
  // Biến để chuyển trang
  const navigate = useNavigate();

  // Các biến kiểm tra quyền người dùng hiện tại
  const isAdmin =
    infoLogin && (infoLogin as UserType)?.role === UserRoleValue.admin;
  const isManager =
    infoLogin && infoLogin?.user?.role === UserRoleValue.manager;

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
      const res = await HandleLogout();
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

  // Admin Manager Header Menu
  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      type: "group",
      label: (
        <div className="user-login">
          <Avatar
            src={
              infoLogin?.image
                ? infoLogin?.image
                : ImageSourcePath + "no-image.png"
            }
            className="avatar"
          />
          <div className="info">
            <b>{infoLogin?.user?.username}</b>
            <span>
              {infoLogin?.user?.role === UserRoleValue?.employee
                ? infoLogin?.currentRole?.name
                : infoLogin?.user?.role}
            </span>
          </div>
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
          children: ManagerHeaderMenuModals.changeInfo(infoLogin),
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
          children: ManagerHeaderMenuModals.changePassword(infoLogin?.user?.id),
        }),
    },
    {
      key: !isManager ? "timetable" : "",
      label: !isManager ? "Lịch làm" : "",
      icon: !isManager ? <CalendarDays /> : undefined,
      onClick: () =>
        openModal({
          title: "Lịch làm",
          width: "90%",
          className: "default timetable",
          children: ManagerHeaderMenuModals.timetable(infoLogin),
        }),
    },
    {
      key: !isManager ? "salary" : "",
      label: !isManager ? "Bảng lương" : "",
      icon: !isManager ? <Banknote /> : undefined,
      onClick: () =>
        openModal({
          title: "Bảng lương",
          width: "90%",
          className: "default sticky payslips",
          children: ManagerHeaderMenuModals.payslip(infoLogin),
        }),
    },
    {
      key: !isManager ? "leave" : "",
      label: !isManager ? "Đơn xin phép" : "",
      icon: !isManager ? <FilePenLine /> : undefined,
      onClick: () =>
        openModal({
          title: "Đơn xin phép",
          width: "90%",
          className: "default permission-ticket",
          children: ManagerHeaderMenuModals.permissionTicket(infoLogin),
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
    changeInfo: (employee: EmployeeType) => (
      <ManagerChangeInfo
        objectEN="employees"
        data={employee}
        closeModal={closeModal}
      />
    ),
    changePassword: (userId: number) => (
      <ManagerChangePassword
        objectEN="employees"
        fieldId={userId}
        closeModal={closeModal}
      />
    ),
    timetable: (employee: EmployeeType) => (
      <ManagerTimetable
        objectEN="schedules"
        data={employee}
        closeModal={closeModal}
      />
    ),
    payslip: (employee: EmployeeType) => {
      return (
        <ManagerPayslip
          employee={employee}
          selectedRestaurant={selectedRestaurant}
        />
      );
    },
    permissionTicket: (employee: EmployeeType) => (
      <ManagerPermissionTicket
        objectEN="permission-tickets"
        objectVN="Đơn xin phép"
        data={employee}
        closeModal={closeModal}
      />
    ),
  };

  return (
    <>
      <Header className="admin-manager-header flex items-center justify-between px-4">
        <h2 className="admin-manager-header__title">{selectedSubmenu}</h2>
        <div className="admin-manager-header__actions">
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
          {!isAdmin ? (
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Avatar
                src={
                  infoLogin?.image
                    ? infoLogin?.image
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
      </Header>
      {modal.open && (
        <CustomModal
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

// Admin Manager Layout
const AdminManagerLayout: FC = () => {
  // Load dữ liệu khi người dùng đăng nhập
  const infoLoginRouteLoaderData = useRouteLoaderData("manager-info-login");
  const infoLogin = infoLoginRouteLoaderData?.infoLogin;
  const isAdmin = infoLogin?.user?.role === UserRoleValue.admin;
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;

  // Collapsed State
  const [collapsed, setCollapsed] = useState<boolean>(false);
  // Submenu Selected State
  const [selectedSubmenu, setSelectedSubmenu] = useState<string>("");

  // Dữ liệu nhà hàng
  const {
    data: restaurants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = isManager
        ? await FindAllRestaurantByManagerId({
            managerId: infoLogin?.id,
          })
        : await FindAllRestaurant({});
      if (res.status === 200) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
  });

  // Xử lý chọn 1 cửa hành để quản lý từ Chủ cửa hàng
  const [selectedRestaurant, setSelectedRestaurant] = useState<number>(0);
  useEffect(() => {
    sessionStorage.setItem(
      "selected-restaurant-id",
      JSON.stringify(selectedRestaurant),
    );
  }, [selectedRestaurant]);

  // Kết nối socket
  const stompClientRef = useRef<Client | null>(null);
  useEffect(() => {
    if (!isAdmin) {
      const socket = new SockJS("http://localhost:8080/websocket");
      const client = over(socket);
      stompClientRef.current = client;

      client.connect({}, () => {
        console.log("WebSocket connected");
        client.subscribe("/topic/admin-messages", (message) => {
          openNotification({
            type: "info",
            message: "Khách hàng nhắn tin",
            description: "Đã có khách hàng đã gửi tin nhắn!",
          });
        });

        client.subscribe("/topic/admin-call-employee", (tableName) => {
          openNotification({
            type: "info",
            message: "Khách hàng gọi hỗ trợ",
            description: `Bàn: ${tableName.body} đã gọi nhân viên hỗ trợ !`,
          });
        });

        client.subscribe("/topic/admin-call-food", (tableName) => {
          openNotification({
            type: "info",
            message: "Khách hàng gọi món ăn",
            description: `Đã có khách hàng đã gọi món ăn !`,
          });
        });
      });

      return () => {
        if (client.connected) {
          client.disconnect(() => console.log("WebSocket disconnected"));
        }
      };
    }
  }, []);

  // Xử lý hiển thị submenu khi chọn nhà hàng
  useEffect(() => {
    if (isManager && !selectedRestaurant) {
      setSelectedSubmenu("Chủ nhà hàng - Chọn nhà hàng để quản lý");
    } else if (isManager && selectedRestaurant) {
      setSelectedSubmenu("");
    }
  }, [isManager, selectedRestaurant]);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
      {isManager && !selectedRestaurant ? (
        restaurants && restaurants?.length > 0 ? (
          <List
            grid={{
              gutter: 24,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 6,
            }}
            dataSource={restaurants}
            renderItem={(item) => (
              <List.Item className="manager-restaurant">
                <Card
                  bordered={true}
                  cover={
                    <img
                      src={
                        item?.restaurantImages![0]?.image
                          ? item?.restaurantImages![0]?.image
                          : ImageSourcePath + "no-image.png"
                      }
                      className="manager-restaurant__image"
                    />
                  }
                >
                  <Card.Meta
                    avatar={<ShopOutlined />}
                    title={
                      <>
                        <p className="name"> {item?.name}</p>
                        <Tag
                          color={
                            item?.status === CommonStatus.active
                              ? "green"
                              : "red"
                          }
                          className="status"
                        >
                          {item?.status}
                        </Tag>
                      </>
                    }
                    description={
                      <>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr",
                            gap: 4,
                          }}
                        >
                          <p>
                            <TeamOutlined style={{ marginRight: 6 }} />
                            {item?.numberOfEmployees || 0} nhân viên
                          </p>
                          <p>
                            <PhoneOutlined style={{ marginRight: 6 }} />
                            {item?.phone || "Chưa cập nhật"}
                          </p>
                          <p>
                            <ProductOutlined style={{ marginRight: 6 }} />
                            {item?.numberOfFoods || 0} món ăn
                          </p>
                          <p className="col-span-2">
                            <MailOutlined style={{ marginRight: 6 }} />
                            {item?.email || "Chưa cập nhật"}
                          </p>
                        </div>
                        <p style={{ display: "flex", marginTop: 4 }}>
                          <EnvironmentOutlined style={{ marginRight: 6 }} />
                          <span>{item?.address || "Chưa cập nhật"}</span>
                        </p>
                      </>
                    }
                  />
                  <Button
                    type="primary"
                    block
                    style={{ marginTop: 24, borderRadius: 8 }}
                    disabled={item?.status === CommonStatus.inactive}
                    onClick={() => setSelectedRestaurant(item?.id!)}
                  >
                    Quản lý nhà hàng {<MoveRight />}
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <div className="manager-inform-warper">
            <div className="manager-inform">
              <img src={ImageSourcePath + "partner-question-icon.png"} alt="" />
              <h2>Chưa có nhà hàng để quản lý</h2>
              <p>
                Vui lòng liên hệ với quản trị hệ thống để được cấp quyền quản lý
                nhà hàng.
              </p>
            </div>
          </div>
        )
      ) : (
        <>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            className="admin-manager-sidebar"
          >
            <CustomBrand to="#!" name="VINAEATERY" />
            <AdminManagerSidebar
              infoLoginRouteLoaderData={infoLoginRouteLoaderData}
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
              setSelectedSubmenu={setSelectedSubmenu}
            />
          </Sider>
        </>
      )}
      <Layout style={{ backgroundColor: "transparent" }}>
        <AdminManagerHeader
          infoLogin={infoLogin}
          selectedRestaurant={selectedRestaurant}
          selectedSubmenu={selectedSubmenu}
        />
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default AdminManagerLayout;
