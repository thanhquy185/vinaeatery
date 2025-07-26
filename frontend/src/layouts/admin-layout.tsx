import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faBellConcierge,
  faBusinessTime,
  faCalendarDays,
  faChartSimple,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faClipboardList,
  faClockRotateLeft,
  faCreditCard,
  faCubesStacked,
  faDollarSign,
  faFileInvoiceDollar,
  faFileSignature,
  faGear,
  faGraduationCap,
  faHandHoldingDollar,
  faJarWheat,
  faLayerGroup,
  faListUl,
  faMedal,
  faMoneyBillTrendUp,
  faPeopleGroup,
  faPersonBreastfeeding,
  faPhoneVolume,
  faPlayCircle,
  faPowerOff,
  faReceipt,
  faSignal,
  faTableCells,
  faTableCellsLarge,
  faUserPen,
  faUsersGear,
  faUsersLine,
  faUserTag,
  faUtensils,
  faWheatAwn,
} from "@fortawesome/free-solid-svg-icons";
import CustomBrand from "../components/common/brand";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Avatar, Popover } from "antd";

// Sidebar group props
type SidebarGroupProps = {
  icon: IconProp;
  title: string;
  items: {
    url: string;
    nameVN: string;
    nameEN: string;
  }[];
};

// Bản đồ chuỗi đến icon thật
const iconMap: Record<string, IconProp> = {
  "dashboard-profit": faDollarSign,
  "dashboard-revenue": faMoneyBillTrendUp,
  "dashboard-expense": faHandHoldingDollar,
  "history-tables": faClockRotateLeft,
  "use-tables": faSignal,
  orders: faReceipt,
  "order-tables": faPhoneVolume,
  "order-sheets": faBellConcierge,
  "customer-cards": faCreditCard,
  customers: faPersonBreastfeeding,
  floors: faLayerGroup,
  "category-tables": faListUl,
  tables: faTableCellsLarge,
  "input-tickets": faClipboardList,
  suppliers: faUserTag,
  "category-ingredients": faJarWheat,
  ingredients: faWheatAwn,
  "category-foods": faListUl,
  foods: faUtensils,
  salary: faFileInvoiceDollar,
  "category-reward-punishes": faMedal,
  "reward-punishes": faGraduationCap,
  schedules: faCalendarDays,
  shifts: faBusinessTime,
  roles: faUsersLine,
  employees: faAddressCard,
};

// Phần Sidebar group
const SidebarGroup: React.FC<SidebarGroupProps> = ({ icon, title, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {items?.length > 0 && (
        <div className="sidebar__group">
          <button
            className="sidebar__button"
            onClick={() => setOpen(!open)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={icon} className="sidebar__button-icon" />
            <span className="sidebar__button-text">{title}</span>
            <FontAwesomeIcon
              icon={open ? faChevronUp : faChevronDown}
              className="sidebar__chevron"
            />
          </button>
          {open && (
            <ul className="sidebar__submenu">
              {items.map((item, index) => (
                <li key={index} className="sidebar__item">
                  <NavLink to={item.url} className="sidebar__action">
                    <FontAwesomeIcon
                      icon={iconMap[item.nameEN]}
                      className="sidebar__action-icon"
                    />
                    <span className="sidebar__action-text">{item.nameVN}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

// Phần sidebar
const AdminSidebar = () => {
  // // Dữ liệu được load ban đầu
  // const admin = useRouteLoaderData("admin");
  // console.log(admin);

  const dashboardItems: SidebarGroupProps["items"] = [
    {
      url: "/admin/dashboard-profit",
      nameVN: "Thống kê Lợi nhuận",
      nameEN: "dashboard-profit",
    },
    {
      url: "/admin/dashboard-revenue",
      nameVN: "Thống kê Doanh thu",
      nameEN: "dashboard-revenue",
    },
    {
      url: "/admin/dashboard-expense",
      nameVN: "Thống kê Chi tiêu",
      nameEN: "dashboard-expense",
    },
  ];
  const activeManagerItems: SidebarGroupProps["items"] = [
    // {
    //   url: "/admin/history-tables",
    //   nameVN: "Lịch sử bàn ăn",
    //   nameEN: "history-tables",
    // },
    {
      url: "/admin/use-tables",
      nameVN: "Sử dụng bàn ăn",
      nameEN: "use-tables",
    },
    {
      url: "/admin/order-sheets",
      nameVN: "Gọi món ăn",
      nameEN: "order-sheets",
    },
    {
      url: "/admin/orders",
      nameVN: "Đơn món ăn",
      nameEN: "orders",
    },
    {
      url: "/admin/order-tables",
      nameVN: "Đơn đặt bàn",
      nameEN: "order-tables",
    },
  ];
  const customerManagerItems: SidebarGroupProps["items"] = [
    {
      url: "/admin/customer-cards",
      nameVN: "Thẻ khách hàng",
      nameEN: "customer-cards",
    },
    {
      url: "/admin/customers",
      nameVN: "Khách hàng",
      nameEN: "customers",
    },
  ];
  const seatManagerItems: SidebarGroupProps["items"] = [
    {
      url: "/admin/floors",
      nameVN: "Tầng",
      nameEN: "floors",
    },
    {
      url: "/admin/category-tables",
      nameVN: "Loại bàn ăn",
      nameEN: "category-tables",
    },
    {
      url: "/admin/tables",
      nameVN: "Bàn ăn",
      nameEN: "tables",
    },
  ];
  const foodManagerItems: SidebarGroupProps["items"] = [
    {
      url: "/admin/input-tickets",
      nameVN: "Phiếu nhập",
      nameEN: "input-tickets",
    },
    { url: "/admin/suppliers", nameVN: "Nhà cung cấp", nameEN: "suppliers" },
    {
      url: "/admin/category-ingredients",
      nameVN: "Loại nguyên liệu",
      nameEN: "category-ingredients",
    },
    {
      url: "/admin/ingredients",
      nameVN: "Nguyên liệu",
      nameEN: "ingredients",
    },
    {
      url: "/admin/category-foods",
      nameVN: "Loại món ăn",
      nameEN: "category-foods",
    },
    { url: "/admin/foods", nameVN: "Món ăn", nameEN: "foods" },
  ];
  const employeeManagerItems: SidebarGroupProps["items"] = [
    // { url: "/admin/payslip", nameVN: "Bảng lương", nameEN: "salary" },
    // {
    //   url: "/admin/category-reward-punishes",
    //   nameVN: "Loại thưởng phạt",
    //   nameEN: "category-reward-punishes",
    // },
    // {
    //   url: "/admin/reward-punishes",
    //   nameVN: "Thưởng phạt",
    //   nameEN: "reward-punishes",
    // },
    // { url: "/admin/schedules", nameVN: "Lịch làm việc", nameEN: "schedules" },
    // { url: "/admin/shifts", nameVN: "Ca làm việc", nameEN: "shifts" },
    { url: "/admin/roles", nameVN: "Chức vụ", nameEN: "roles" },
    { url: "/admin/employees", nameVN: "Nhân viên", nameEN: "employees" },
  ];

  // Biến giữ giá trị trạng thái ẩn hiện thanh sidebar
  const [showSidebar, setShowSidebar] = useState<Boolean>(true);

  return (
    <>
      <div
        id="admin-sidebar"
        className={"sidebar col-2" + (showSidebar ? "" : " hide")}
      >
        <CustomBrand to="#!" prefixClassName="sidebar__" name="VINAEATERY" />
        <ul className="sidebar__menu">
          {/* <SidebarGroup
            title="Thống kê"
            icon={faChartSimple}
            items={dashboardItems}
          /> */}
          <SidebarGroup
            title="Vận hành quán ăn"
            icon={faPlayCircle}
            items={activeManagerItems}
          />
          {/* <SidebarGroup
            title="Quản lý khách hàng"
            icon={faPeopleGroup}
            items={customerManagerItems}
          /> */}
          {/* <SidebarGroup
            title="Quản lý chỗ ngồi"
            icon={faTableCells}
            items={seatManagerItems}
          /> */}
          {/* <SidebarGroup
            title="Quản lý món ăn"
            icon={faCubesStacked}
            items={foodManagerItems}
          /> */}
          {/* <SidebarGroup
            title="Quản lý nhân sự"
            icon={faUsersGear}
            items={employeeManagerItems}
          /> */}
        </ul>
        <div className="sidebar__employee">
          <Avatar
            src="/src/assets/images/others/no-image.png"
            alt="no-image.png"
            size={48}
            className="sidebar__employee-avatar"
          />
          <div className="sidebar__employee-info">
            <h2
              className="line-clamp"
              style={{ "--line-clamp": 1 } as React.CSSProperties}
            >
              Trần Thanh Quy
            </h2>
            <br />
            <p
              className="line-clamp"
              style={{ "--line-clamp": 1 } as React.CSSProperties}
            >
              Nhân viên
            </p>
          </div>
          <Popover
            content={
              <>
                <ul className="sidebar__employee-actions">
                  <li className="sidebar__employee-action">
                    <button>
                      <FontAwesomeIcon icon={faUserPen} className="icon" />
                      &nbsp;&nbsp;Chỉnh sửa thông tin cá nhân
                    </button>
                  </li>
                  <li className="sidebar__employee-action">
                    <button>
                      <FontAwesomeIcon icon={faCalendarDays} className="icon" />
                      &nbsp;&nbsp;Lịch làm việc cá nhân
                    </button>
                  </li>
                  <li className="sidebar__employee-action">
                    <button>
                      <FontAwesomeIcon
                        icon={faFileInvoiceDollar}
                        className="icon"
                      />
                      &nbsp;&nbsp;Bảng lương cá nhân
                    </button>
                  </li>
                  <li className="sidebar__employee-action">
                    <button>
                      <FontAwesomeIcon
                        icon={faFileSignature}
                        className="icon"
                      />
                      &nbsp;&nbsp;Đơn xin nghỉ phép
                    </button>
                  </li>
                  <li className="sidebar__employee-action">
                    <button>
                      <FontAwesomeIcon icon={faPowerOff} className="icon" />
                      &nbsp;&nbsp;Đăng xuất
                    </button>
                  </li>
                </ul>
              </>
            }
            title=""
            trigger="click"
          >
            <button className="sidebar__employee-btn">
              <FontAwesomeIcon icon={faGear} />
            </button>
          </Popover>
        </div>
        <button
          type="button"
          className="sidebar__show-sidebar"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <FontAwesomeIcon
            icon={showSidebar ? faChevronLeft : faChevronRight}
          />
        </button>
      </div>
    </>
  );
};

// Admin layout
const AdminLayout = () => {
  return (
    <>
      <AdminSidebar />
      <Outlet />
    </>
  );
};

export default AdminLayout;
