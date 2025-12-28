import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faPlayCircle,
  faTableCells,
  faCubesStacked,
  faUsersGear,
  faUserPen,
  faCalendarDays,
  faFileInvoiceDollar,
  faFileSignature,
  faPowerOff,
  faUtensils,
  faUserGear,
  faUserTie,
  faArrowLeft,
  faArrowRight,
  faBuildingCircleExclamation,
  faUserTag,
  faGear,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import type {
  CustomersFormatType,
  EmployeesFormatType,
  FunctionsType,
  ManagersFormatType,
  RestaurantsFormatType,
  UsersType,
} from "../common/types";
import CustomBrand from "../components/common/brand";
import {
  FindAllRestaurant,
  FindAllRestaurantByManagerId,
  HandleLogout,
} from "../services/api";
import { getFunctionIdsString } from "../services/employee-login";
import { openNotification } from "../utils/showNotification";
import { openConfirmation } from "../utils/showConfirmation";
import { useTranslation } from "react-i18next";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import { CommonStatus, UserRoleValue } from "../common/values";
import { useQuery } from "@tanstack/react-query";

const { Header, Sider } = Layout;

// Hàm lấy ra danh sách các chức năng mà nhân viên có thể thực hiện
const getValidFunctions = ({
  infoLogin,
  functions,
  functionCategory,
  functionIdsEmployee,
}: {
  infoLogin: EmployeesFormatType;
  functions: FunctionsType[];
  functionCategory: string;
  functionIdsEmployee: string;
}) => {
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  const isEmployee = infoLogin?.user?.role === UserRoleValue.employee;

  return functions
    ?.filter(
      (func: FunctionsType) =>
        (isManager || isEmployee) &&
        func.category === functionCategory &&
        functionIdsEmployee
          .split("|")
          .some((functionId) => functionId === String(func.id))
    )
    .map((func: FunctionsType) => ({
      key: func.nameEN,
      label: (
        <NavLink to={`/${isManager ? "manager" : "employee"}/${func.nameEN}`}>
          {func.nameVN}
        </NavLink>
      ),
    }));
};

// Admin Sidebar
const AdminSidebar = ({
  infoLoginRouteLoaderData,
  selectedRestaurant,
  setSelectedRestaurant,
  setSelectedSubmenu,
}: {
  infoLoginRouteLoaderData: any;
  selectedRestaurant: number;
  setSelectedRestaurant: Dispatch<SetStateAction<number>>;
  setSelectedSubmenu: Dispatch<SetStateAction<string>>;
}) => {
  // Dữ liệu được load ban đầu
  const functions: FunctionsType[] = infoLoginRouteLoaderData
    ? infoLoginRouteLoaderData.functions
    : null;
  const infoLogin: EmployeesFormatType = infoLoginRouteLoaderData
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
    infoLogin && (infoLogin as UsersType)?.role === UserRoleValue.admin;
  const isManager =
    infoLogin && infoLogin?.user?.role === UserRoleValue.manager;

  // Các chức năng theo từng mục của quản lý
  const managerDashboardItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "dashboard",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : functionIdsEmployee ?? "",
  });
  const managerActiveManagerItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "active",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : functionIdsEmployee ?? "",
  });
  // const managerCustomerManagerItems = getValidFunctions({
  //   functions,
  //   functionCategory: "customer",
  //   functionIdsEmployee: functionIdsEmployee!,
  // });
  const managerSeatManagerItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "seat",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : functionIdsEmployee ?? "",
  });
  const managerFoodManagerItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "food",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : functionIdsEmployee ?? "",
  });
  const managerEmployeeManagerItems = getValidFunctions({
    infoLogin,
    functions,
    functionCategory: "employee",
    functionIdsEmployee: isManager
      ? (functions?.map((f) => f.id) || []).join("|")
      : functionIdsEmployee ?? "",
  });

  return (
    <Menu
      mode="inline"
      theme="light"
      items={[
        isAdmin && {
          key: "restaurants",
          icon: <FontAwesomeIcon icon={faBuilding} />,
          label: <NavLink to={`/admin/restaurants`}>Nhà hàng</NavLink>,
        },
        isAdmin && {
          key: "managers",
          icon: <FontAwesomeIcon icon={faUserTie} />,
          label: <NavLink to={`/admin/managers`}>Chủ nhà hàng</NavLink>,
        },
        isAdmin && {
          key: "customers",
          icon: <FontAwesomeIcon icon={faUserTag} />,
          label: <NavLink to={`/admin/customers`}>Khách hàng</NavLink>,
        },
        isAdmin && {
          key: "users",
          icon: <FontAwesomeIcon icon={faGear} />,
          label: <NavLink to={`/admin/users`}>Tài khoản</NavLink>,
        },
        isManager &&
          selectedRestaurant && {
            key: "restaurant-info",
            icon: <FontAwesomeIcon icon={faBuildingCircleExclamation} />,
            label: (
              <NavLink to={`/manager/restaurant-info`}>
                Thông tin nhà hàng
              </NavLink>
            ),
          },
        !isAdmin &&
          managerDashboardItems?.length! > 0 && {
            key: "dashboard",
            icon: <FontAwesomeIcon icon={faChartSimple} />,
            label: "Thống kê",
            children: managerDashboardItems,
          },
        !isAdmin &&
          managerActiveManagerItems?.length! > 0 && {
            key: "active",
            icon: <FontAwesomeIcon icon={faPlayCircle} />,
            label: "Vận hành quán ăn",
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
            icon: <FontAwesomeIcon icon={faTableCells} />,
            label: "Quản lý chỗ ngồi",
            children: managerSeatManagerItems,
          },
        !isAdmin &&
          managerFoodManagerItems?.length! > 0 && {
            key: "food",
            icon: <FontAwesomeIcon icon={faCubesStacked} />,
            label: "Quản lý món ăn",
            children: managerFoodManagerItems,
          },
        !isAdmin &&
          managerEmployeeManagerItems?.length! > 0 && {
            key: "employee",
            icon: <FontAwesomeIcon icon={faUsersGear} />,
            label: "Quản lý nhân sự",
            children: managerEmployeeManagerItems,
          },
        isManager && {
          key: "",
          icon: <FontAwesomeIcon icon={faArrowLeft} />,
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

// Admin Header
const AdminHeader = ({
  infoLogin,
  selectedSubmenu,
}: {
  infoLogin: any;
  selectedSubmenu: string;
}) => {
  //
  const navigate = useNavigate();

  //
  const isAdmin =
    infoLogin && (infoLogin as UsersType)?.role === UserRoleValue.admin;
  const isManager =
    infoLogin && infoLogin?.user?.role === UserRoleValue.manager;

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
  };

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
                : "/src/assets/images/others/no-image.png"
            }
            className="avatar"
          />
          <div className="info">
            <b>{infoLogin?.fullname}</b>
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
      key: "public",
      label: <NavLink to="/public">Trang khách hàng</NavLink>,
      icon: <FontAwesomeIcon icon={faGear} />,
    },
    {
      key: !isManager ? "profile" : "",
      label: !isManager ? "Chỉnh sửa thông tin" : "",
      icon: !isManager ? <FontAwesomeIcon icon={faUserPen} /> : undefined,
    },
    {
      key: !isManager ? "schedule" : "",
      label: !isManager ? "Lịch làm việc" : "",
      icon: !isManager ? <FontAwesomeIcon icon={faCalendarDays} /> : undefined,
    },
    {
      key: !isManager ? "salary" : "",
      label: !isManager ? "Bảng lương" : "",
      icon: !isManager ? (
        <FontAwesomeIcon icon={faFileInvoiceDollar} />
      ) : undefined,
    },
    {
      key: !isManager ? "leave" : "",
      label: !isManager ? "Đơn nghỉ phép" : "",
      icon: !isManager ? <FontAwesomeIcon icon={faFileSignature} /> : undefined,
    },
    {
      key: "logout",
      label: (
        <Button type="primary" className="logout">
          <FontAwesomeIcon icon={faPowerOff} />
          <span>{t("logout")}</span>
        </Button>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="header flex items-center justify-between px-4">
      <h2 className="header__title">{selectedSubmenu}</h2>
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
                  : "/src/assets/images/others/no-image.png"
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
              <FontAwesomeIcon icon={faGear} />
            </Button>
            <Button
              variant="solid"
              color="primary"
              style={{ padding: "10px", fontSize: 18 }}
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </Button>
          </>
        )}
      </div>
    </Header>
  );
};

// Admin Layout
const AdminManagerLayout = () => {
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
      JSON.stringify(selectedRestaurant)
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
            description: "Đã có khách hàng đã gửi tin nhắn !",
            duration: 1.5,
          });
        });

        client.subscribe("/topic/admin-call-employee", (tableName) => {
          openNotification({
            type: "info",
            message: "Khách hàng gọi hỗ trợ",
            description: `Bàn: ${tableName.body} đã gọi nhân viên hỗ trợ !`,
            duration: 1.5,
          });
        });

        client.subscribe("/topic/admin-call-food", (tableName) => {
          openNotification({
            type: "info",
            message: "Khách hàng gọi món ăn",
            description: `Đã có khách hàng đã gọi món ăn !`,
            duration: 1.5,
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
                          : "/src/assets/images/others/no-image.png"
                      }
                      className="manager-restaurant__image"
                    />
                  }
                >
                  <Card.Meta
                    avatar={<ShopOutlined />}
                    title={
                      <>
                        <p className="name"> {item.name}</p>
                        <Tag
                          color={
                            item.status === CommonStatus.active
                              ? "green"
                              : "red"
                          }
                          className="status"
                        >
                          {item.status}
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
                            {item.numberOfEmployees || 0} nhân viên
                          </p>
                          <p>
                            <PhoneOutlined style={{ marginRight: 6 }} />
                            {item.phone || "Chưa cập nhật"}
                          </p>
                          <p>
                            <ProductOutlined style={{ marginRight: 6 }} />
                            {item.numberOfFoods || 0} món ăn
                          </p>
                          <p className="col-span-2">
                            <MailOutlined style={{ marginRight: 6 }} />
                            {item.email || "Chưa cập nhật"}
                          </p>
                        </div>
                        <p style={{ display: "flex", marginTop: 4 }}>
                          <EnvironmentOutlined style={{ marginRight: 6 }} />
                          <span>{item.address || "Chưa cập nhật"}</span>
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
                    Quản lý nhà hàng {<FontAwesomeIcon icon={faArrowRight} />}
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <div className="manager-inform-warper">
            <div className="manager-inform">
              <img
                src="/src/assets/images/others/partner-question-icon.png"
                alt=""
              />
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
            className="sidebar"
          >
            <CustomBrand
              to="#!"
              prefixClassName="sidebar__"
              name="VINAEATERY"
            />
            <AdminSidebar
              infoLoginRouteLoaderData={infoLoginRouteLoaderData}
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
              setSelectedSubmenu={setSelectedSubmenu}
            />
          </Sider>
        </>
      )}
      <Layout style={{ backgroundColor: "transparent" }}>
        <AdminHeader infoLogin={infoLogin} selectedSubmenu={selectedSubmenu} />
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default AdminManagerLayout;
