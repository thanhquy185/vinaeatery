import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
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
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { useQuery } from "@tanstack/react-query";
import { HandleAccount, HandleLogout } from "../services/api";
import { openNotification } from "../utils/showNotification";
import { setEmployee } from "../store/employee-slice";
import { openConfirmation } from "../utils/showConfirmation";
import type { FunctionsType } from "../common/types";
import { getFunctionIdsString } from "../services/employee-login";


// Hàm lấy ra danh sách các chức năng mà nhân viên có thể thực hiện
const getValidFunctions = (
  {
    functions,
    functionCategory,
    functionIdsEmployee
  }: { functions: FunctionsType[], functionCategory: string, functionIdsEmployee: string }
) => {
  return functions?.filter(
    (func: FunctionsType) => func.category === functionCategory
      && functionIdsEmployee.split("|").some(
        (functionId) => functionId === String(func.id)
      )
  ).map((func: FunctionsType) => {
    return ({
      url: "/admin/" + func.nameEN,
      nameVN: func.nameVN,
      nameEN: func.nameEN,
    })
  }) as SidebarGroupProps["items"];
}

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
  "dashboard-orders": faMoneyBillTrendUp,
  "dashboard-input-tickets": faHandHoldingDollar,
  "table-histories": faClockRotateLeft,
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
  // Navigate
  const navigate = useNavigate();

  // Dữ liệu được load ban đầu
  // - Danh sách chức năng
  const functions = useRouteLoaderData("admin")!.functions;
  // - Tài khoản nhân viên đang đăng nhập
  const employeeLogin = useRouteLoaderData("admin")!.employeeLogin;
  // - Danh sách mã các chức năng của nhân viên
  const functionIdsEmployee = getFunctionIdsString({ currentEmployeeLogin: employeeLogin });

  // Các chức năng theo từng mục
  // - Thống kê
  const dashboardItems: SidebarGroupProps["items"] = getValidFunctions({
    functions: functions,
    functionCategory: "dashboard",
    functionIdsEmployee: functionIdsEmployee!
  });
  // - Vận hàng quán ăn
  const activeManagerItems: SidebarGroupProps["items"] = getValidFunctions({
    functions: functions,
    functionCategory: "active",
    functionIdsEmployee: functionIdsEmployee!
  });
  // - Quản lý khách hàng
  const customerManagerItems: SidebarGroupProps["items"] = getValidFunctions({
    functions: functions,
    functionCategory: "customer",
    functionIdsEmployee: functionIdsEmployee!
  });
  // - Quản lý chỗ ngồi
  const seatManagerItems: SidebarGroupProps["items"] = getValidFunctions({
    functions: functions,
    functionCategory: "seat",
    functionIdsEmployee: functionIdsEmployee!
  });
  // - Quản lý món ăn
  const foodManagerItems: SidebarGroupProps["items"] = getValidFunctions({
    functions: functions,
    functionCategory: "food",
    functionIdsEmployee: functionIdsEmployee!
  });
  // - Quản lý nhân sự
  const employeeManagerItems: SidebarGroupProps["items"] = getValidFunctions({
    functions: functions,
    functionCategory: "employee",
    functionIdsEmployee: functionIdsEmployee!
  });

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
          {
            dashboardItems.length > 0 && (
              <SidebarGroup
                title="Thống kê"
                icon={faChartSimple}
                items={dashboardItems}
              />
            )
          }
          {
            activeManagerItems.length > 0 && (
              <SidebarGroup
                title="Vận hành quán ăn"
                icon={faPlayCircle}
                items={activeManagerItems}
              />
            )
          }
          {
            customerManagerItems.length > 0 && (
              <SidebarGroup
                title="Quản lý khách hàng"
                icon={faPeopleGroup}
                items={customerManagerItems}
              />
            )
          }
          {
            seatManagerItems.length > 0 && (
              <SidebarGroup
                title="Quản lý chỗ ngồi"
                icon={faTableCells}
                items={seatManagerItems}
              />
            )
          }
          {
            foodManagerItems.length > 0 && (
              <SidebarGroup
                title="Quản lý món ăn"
                icon={faCubesStacked}
                items={foodManagerItems}
              />
            )
          }
          {
            employeeManagerItems.length > 0 && (
              <SidebarGroup
                title="Quản lý nhân sự"
                icon={faUsersGear}
                items={employeeManagerItems}
              />
            )
          }
        </ul>
        {
          employeeLogin!.id && (
            <div className="sidebar__employee">
              <Avatar
                src={
                  employeeLogin!.image!
                    ? "/src/assets/images/employees/" + employeeLogin!.image
                    : "/src/assets/images/others/no-image.png"
                }
                alt="avatar"
                size={48}
                className="sidebar__employee-avatar"
              />
              <div className="sidebar__employee-info">
                <h2
                  className="line-clamp"
                  style={{ "--line-clamp": 1 } as React.CSSProperties}
                >
                  {employeeLogin!.fullname}
                </h2>
                <br />
                <p
                  className="line-clamp"
                  style={{ "--line-clamp": 1 } as React.CSSProperties}
                >
                  {employeeLogin!.currentRole!.name}
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
                      <li
                        className="sidebar__employee-action"
                        onClick={async (e) => {
                          // Thêm class 'active' thể hiện là đang được nhấn
                          e.currentTarget.classList.add("active");

                          // Hỏi trước khi xử khi xử lý ?
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

                              setTimeout(() => {
                                navigate("/login")
                              }, 1500);
                            } else {
                              openNotification({
                                type: "error",
                                message: "Thất bại",
                                description: res!.data ? String(res!.data) : "Đăng xuất thất bại",
                                duration: 1.5,
                              });

                              // Xoá class 'active' thể hiện là đang được nhấn
                              e.currentTarget.classList.remove("active");
                            }
                          }

                          // // Xoá class 'active' thể hiện là đang được nhấn
                          // e.currentTarget.classList.remove("active");
                        }}
                      >
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
          )
        }
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
