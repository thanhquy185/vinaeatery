import { useEffect, useState, type FC, type ReactNode } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  BookOpen,
  Search,
  LogIn,
  Compass,
  UserPlus,
  Beef,
  UserPen,
  UserCog2,
  UserCircle,
  ShieldUser,
  UserCog,
  LockKeyhole,
  Bolt,
  Building,
  ConciergeBell,
} from "lucide-react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import AuthModal from "../components/public/auth-login";
import type { CustomerType, EmployeeType, UserType } from "../common/types";
import { openNotification } from "../utils/show-notification";
import { openConfirmation } from "../utils/show-confirmation";
import { ImageSourcePath, UserRoleValue } from "../common/values";
import { HandleLogout } from "../requests/auth";

// --- Components ---
interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

// const CustomerHeader = ({
//   infoLogin,
// }: {
//   infoLogin: EmployeeType;
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Gắn logic thật vào đây
//   const isAuthenticated = Boolean(infoLogin && infoLogin.id);
//   const activePath = location.pathname;

//   const navItems: NavItem[] = isAuthenticated
//     ? [
//         { name: "Trang chủ", path: "/public", icon: <Home /> },
//         { name: "Nhà hàng", path: "/public/restaurant", icon: <Beef /> },
//         {
//           name: "Lịch Sử",
//           path: "/public/history",
//           icon: <BookOpen />,
//         },
//         { name: "Thông tin", path: "/public/info", icon: <User /> },
//       ]
//     : [
//         { name: "Trang chủ", path: "/public", icon: <Home /> },
//         { name: "Nhà hàng", path: "/public/restaurant", icon: <Beef /> },
//       ];

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<"login" | "signup">("login");
//   // Hàm mở Modal
//   const showAuthModal = (type: "login" | "signup") => {
//     setModalType(type);
//     setIsModalOpen(true);
//   };
//   // Hàm đóng Modal
//   const handleCancel = () => {
//     setIsModalOpen(false);
//     // Có thể reset form ở đây nếu cần
//   };

//   // Hàm xác định xem đường dẫn có đang active không
//   const isNavItemActive = (path: string) => {
//     // Logic đơn giản: nếu đường dẫn hiện tại khớp
//     return activePath === path;
//   };

//   // Component Menu Người dùng đã đăng nhập (Desktop)
//   const UserMenu = () => (
//     <div className="flex items-center gap-4 space-x-2">
//       <span className="text-3xl! text-base font-medium text-gray-600 hidden lg:inline-block">
//         Xin chào, <b className="text-red-600">{infoLogin?.fullname}</b>
//       </span>
//       <Button
//         // type="primary"
//         style={{
//           padding: "0",
//           border: "none",
//           fontSize: 15,
//           fontWeight: 600,
//         }}
//         onClick={async () => {
//           const answer = await openConfirmation({
//             title: `Bạn có chắc chắn đăng xuất ?`,
//             content: "Hành động này không thể hoàn tác.",
//           });
//           if (answer) {
//             const res = await HandleLogout();
//             if (res!.status === 200) {
//               openNotification({
//                 type: "success",
//                 message: "Thành công",
//                 description: "Đăng xuất thành công",
//
//               });
//               setTimeout(() => window.location.href = "/public", 1500);
//             } else {
//               openNotification({
//                 type: "error",
//                 message: "Thất bại",
//                 description: res!.data
//                   ? String(res!.data)
//                   : "Đăng xuất thất bại",
//
//               });
//             }
//           }
//         }}
//         aria-label="Đăng Xuất"
//       >
//         <LogOut className="w-10 h-10 inline-block" />
//       </Button>
//     </div>
//   );

//   // Component Nút Đăng nhập/Đăng ký (Desktop)
//   const AuthButtons = () => (
//     <div className="flex items-center gap-5">
//       {/* Nút Đăng Nhập (Ghost/Outline) */}
//       <Button
//         type="primary"
//         style={{
//           padding: "20px 24px",
//           fontSize: 15,
//           fontWeight: 600,
//         }}
//         onClick={() => showAuthModal("login")}
//       >
//         <LogIn className="w-8 h-8 mr-1 inline-block" />
//         <span>Đăng Nhập</span>
//       </Button>
//       {/* Nút Đăng Ký (Solid) */}
//       <Button
//         style={{
//           padding: "20px 24px",
//           fontSize: 15,
//           fontWeight: 600,
//         }}
//         onClick={() => showAuthModal("signup")}
//       >
//         Đăng Ký
//       </Button>
//     </div>
//   );

//   return (
//     <>
//       <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
//         <div className="container mx-auto py-8!">
//           <div className="h-20 flex items-center justify-between">
//             {/* Logo */}
//             <a
//               href="/"
//               className="flex items-center gap-4 text-5xl font-extrabold tracking-tight text-red-600 hover:text-red-700 transition"
//             >
//               <img
//                 src=ImageSourcePath + "brand-image.png"
//                 alt=""
//                 style={{ width: 70, height: 70 }}
//               />
//               <strong className="text-red-700 font-bold">VINAEATERY</strong>
//             </a>
//             {/* Desktop Navigation & Auth/User Menu */}
//             <nav className="hidden md:flex items-center gap-2 lg:gap-6">
//               {/* Nav Items */}
//               {navItems.map((item) => {
//                 const isActive = isNavItemActive(item.path);

//                 return (
//                   <NavLink
//                     key={item.name}
//                     to={item.path}
//                     className={`flex items-center gap-3 text-base font-medium px-4! py-4! rounded-full transition ${
//                       isActive
//                         ? "bg-red-50! text-red-700! font-semibold"
//                         : "text-gray-600 hover:bg-gray-50! hover:text-red-600!"
//                     }`}
//                   >
//                     <span>{item.icon}</span>
//                     <span className="text-2xl">{item.name}</span>
//                   </NavLink>
//                 );
//               })}
//               {/* User/Auth Section */}
//               <div
//                 className={
//                   (isAuthenticated ? "ml-68!" : "ml-150!") +
//                   " border-l border-gray-200"
//                 }
//               >
//                 {isAuthenticated ? <UserMenu /> : <AuthButtons />}
//               </div>
//             </nav>
//           </div>
//         </div>
//       </header>
//       <AuthModal
//         isOpen={isModalOpen}
//         modalType={modalType}
//         handleCancel={handleCancel}
//         setModalType={setModalType}
//       />
//     </>
//   );
// };

const CustomerHeader: FC<{ infoLogin: EmployeeType }> = ({ infoLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = Boolean(infoLogin && infoLogin.id);
  const isAdmin =
    infoLogin && (infoLogin as UserType)?.role === UserRoleValue.admin;
  const isManager = infoLogin && infoLogin?.user?.role == UserRoleValue.manager;
  const isCustomer =
    infoLogin && infoLogin?.user?.role == UserRoleValue.customer;

  const navItems: NavItem[] = [
    { name: "Trang chủ", path: "/public", icon: <Home /> },
    { name: "Nhà hàng", path: "/public/restaurant", icon: <Building /> },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
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
                infoLogin?.image
                  ? (infoLogin?.image as string)
                  : ImageSourcePath + "no-image.png"
              }
              className="avatar"
            />
            <div className="info">
              <b>
                {isAdmin
                  ? (infoLogin as UserType)?.username
                  : infoLogin?.user?.username}
              </b>
              <span>
                {isAdmin
                  ? (infoLogin as UserType)?.role
                  : infoLogin?.user?.role}
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
        key: isCustomer ? "order-restaurant" : "",
        label: isCustomer ? (
          <NavLink to="/public/order-restaurant">Lịch sử đặt bàn</NavLink>
        ) : (
          ""
        ),
        icon: isCustomer ? <ConciergeBell /> : undefined,
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
                  ? (infoLogin as UserType)?.username
                  : infoLogin?.user?.username}
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
              const res = await HandleLogout();
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
      <header className="sticky top-0 z-50 bg-white/20 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto py-8!">
          <div className="h-20 flex items-center">
            <a
              href="/"
              className="flex items-center gap-4 text-5xl font-extrabold tracking-tight text-red-600 hover:text-red-700 transition"
            >
              <img
                src={ImageSourcePath + "brand-image.png"}
                alt=""
                style={{ width: 70, height: 70 }}
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
      <AuthModal
        isOpen={isModalOpen}
        modalType={modalType}
        handleCancel={handleCancel}
        setModalType={setModalType}
      />
    </>
  );
};

const CustomerFooter: FC = () => {
  // Footer
  const socialLinksFooter = [
    { icon: faFacebook, name: "Facebook", url: "#" },
    { icon: faInstagram, name: "Instagram", url: "#" },
    { icon: faTwitter, name: "Twitter", url: "#" },
  ];
  const quickLinks = [
    { name: "Trang chủ", href: "#home" },
    { name: "Giới thiệu", href: "#about" },
    { name: "Thực đơn", href: "#menu" },
    { name: "Đội ngũ", href: "#team" },
    { name: "Thành tựu", href: "#achievements" },
    { name: "Liên hệ", href: "#contact" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto !py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <img
                src={ImageSourcePath + "brand-image.png"}
                alt="brand-logo"
                className="size-25"
              />
              <strong className="text-white text-5xl font-bold">
                VINAEATERY
              </strong>
            </div>
            <p className="!mt-6 text-gray-400 text-2xl leading-relaxed">
              Mang đến những trải nghiệm ẩm thực tuyệt vời với hương vị đặc sắc
              từ khắp ba miền đất nước.
            </p>
            <div className="flex align-center gap-4">
              {socialLinksFooter.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center size-15 bg-gray-600 !mt-6 rounded-full hover:bg-[#b91c1c] transition-all"
                >
                  <FontAwesomeIcon icon={social.icon} className="text-2xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold">Liên kết nhanh</h3>
            <ul className="!mt-10">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="flex items-center !mt-4 text-2xl text-gray-400 transition-colors group hover:text-[#b91c1c]"
                  >
                    {/* <span className="size-3 bg-[#b91c1c] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span> */}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold">Thông tin liên hệ</h3>
            <ul className="!mt-10">
              <li className="flex items-start gap-3 !mt-4">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="mt-1 text-2xl text-[#b91c1c] flex-shrink-0"
                />
                <div>
                  <p className="text-2xl text-gray-300">123 Đường Nguyễn Huệ</p>
                  <p className="text-gray-400 text-lg">Quận 1, TP.HCM</p>
                </div>
              </li>
              <li className="flex items-center gap-3 !mt-4">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-2xl text-[#b91c1c] flex-shrink-0"
                />
                <p className="text-2xl text-gray-300">0123 456 789</p>
              </li>
              <li className="flex items-center gap-3 !mt-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-2xl text-[#b91c1c] flex-shrink-0"
                />
                <p className="text-2xl text-gray-300">info@delicious.vn</p>
              </li>
              <li className="flex items-start gap-3 !mt-4">
                <FontAwesomeIcon
                  icon={faClock}
                  className="mt-1 text-2xl text-[#b91c1c] flex-shrink-0"
                />
                <div>
                  <p className="text-2xl text-gray-300">06:00 - 23:00</p>
                  <p className="text-gray-400 text-lg">Tất cả các ngày</p>
                </div>
              </li>
            </ul>
          </motion.div>
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold">Nhận thông tin mới</h3>
            <p className="text-gray-400 !mt-10 text-2xl">
              Đăng ký để nhận thông tin về các món ăn mới và ưu đãi đặc biệt.
            </p>
            <div className="space-y-4 !mt-6">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full bg-gray-700 !py-5 !px-4 !border !border-gray-500 !border-2 rounded-lg text-2xl focus:outline-none focus:!border-[#b91c1c] transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full !bg-[#b91c1c] !py-5 !px-4 rounded-lg text-2xl text-white font-semibold transition-all"
              >
                Đăng ký
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="!border-t !border-gray-500">
        <div className="container mx-auto !px-4 !py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-2xl">
              © 2025 Hệ thống nhà Hàng Vinaeatery. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex !space-x-6 text-2xl">
              <a
                href="#"
                className="text-gray-400 hover:text-[#d32f2f] transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#d32f2f] transition-colors"
              >
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CustomerLayout: FC = () => {
  // Load dữ liệu khách hàng đang đăng nhập
  const infoLoginRouteLoaderData =
    useRouteLoaderData("public-info-login") || {};
  const infoLogin =
    (infoLoginRouteLoaderData.infoLogin as CustomerType) || undefined;

  useEffect(() => {
    // Đảm bảo CSS được import nếu cần
    import("../assets/styles/tailwind.css");
  }, []);

  return (
    <div className="min-h-screen flex flex-col public-layout bg-white">
      <CustomerHeader infoLogin={infoLogin} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
};

export default CustomerLayout;
