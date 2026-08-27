import SockJS from "sockjs-client";
import BrandComponent from "../components/BrandComponent";
import AdminManagerHeaderComponent from "../components/layout/AdminManagerHeaderComponent";
import AdminManagerSidebarComponent from "../components/layout/AdminManagerSidebarComponent";
import AdminManagerRestaurantsComponent from "../components/layout/AdminManagerRestaurantsComponent";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useRouteLoaderData } from "react-router-dom";
import { Layout } from "antd";
import { Client, over } from "stompjs";
import { openNotification } from "../utils/showNotificationUtil";

type AdminManagerLayoutProps = {
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
};

const AdminManagerLayout: React.FC<AdminManagerLayoutProps> = ({
  isAdmin,
  isManager,
  isEmployee,
}) => {
  // Load dữ liệu khi người dùng đăng nhập
  const infoLoginRouteLoaderData = isAdmin
    ? useRouteLoaderData("admin-info-login")
    : useRouteLoaderData("manager-info-login");
  const infoLogin = infoLoginRouteLoaderData.infoLogin;

  // Collapsed State
  const [collapsed, setCollapsed] = useState<boolean>(false);
  // Submenu Selected State
  const [selectedSubmenu, setSelectedSubmenu] = useState<string>("");
  // Xử lý chọn 1 cửa hành để quản lý từ Chủ cửa hàng
  const [selectedRestaurant, setSelectedRestaurant] = useState<number>(0);

  // Kết nối socket
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      const socket = new SockJS("http://localhost:8080/websocket");
      const client = over(socket);
      stompClientRef.current = client;

      client.connect({}, () => {
        console.log("WebSocket connected");

        client.subscribe("/topic/customer-call-employee", (tableName) => {
          openNotification({
            type: "info",
            message: "Khách hàng gọi hỗ trợ",
            description: `Bàn: ${tableName.body} đã gọi nhân viên hỗ trợ!`,
          });
        });

        client.subscribe("/topic/customer-call-food", (tableName) => {
          openNotification({
            type: "info",
            message: "Khách hàng gọi món ăn",
            description: `Bàn: ${tableName.body} đã gọi món ăn!`,
          });
        });

        client.subscribe("/topic/customer-cancel-order-sheet", (tableName) => {
          openNotification({
            type: "info",
            message: "Khách hàng huỷ phiếu gọi món",
            description: `Bàn: ${tableName.body} đã huỷ phiếu gọi món!`,
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
  useMemo(() => {
    sessionStorage.setItem(
      "selected-restaurant-id",
      JSON.stringify(selectedRestaurant),
    );
  }, [selectedRestaurant]);
  useMemo(() => {
    if (isManager && !selectedRestaurant) {
      setSelectedSubmenu("Chủ nhà hàng - Chọn nhà hàng để quản lý");
    } else if (isManager && selectedRestaurant) {
      setSelectedSubmenu("");
    }
  }, [isManager, selectedRestaurant]);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
      {isManager && !selectedRestaurant ? (
        <AdminManagerRestaurantsComponent
          infoLogin={infoLogin}
          setSelectedRestaurant={setSelectedRestaurant}
        />
      ) : (
        <Layout.Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className="admin-manager-sidebar"
        >
          <BrandComponent to="#!" name="VINAEATERY" />
          <AdminManagerSidebarComponent
            isAdmin={isAdmin}
            isManager={isManager}
            infoLoginRouteLoaderData={infoLoginRouteLoaderData}
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
            setSelectedSubmenu={setSelectedSubmenu}
          />
        </Layout.Sider>
      )}
      <Layout style={{ backgroundColor: "transparent" }}>
        <AdminManagerHeaderComponent
          isAdmin={isAdmin}
          isManager={isManager}
          isEmployee={isEmployee}
          infoLogin={infoLogin}
          selectedSubmenu={selectedSubmenu}
        />
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default AdminManagerLayout;
