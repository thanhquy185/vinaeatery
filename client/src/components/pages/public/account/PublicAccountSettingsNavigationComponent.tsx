import { NavLink } from "react-router-dom";

type PublicAccountSettingsNavigationComponentProps = {
  activePage: "profile" | "password";
};

const PublicAccountSettingsNavigationComponent: React.FC<
  PublicAccountSettingsNavigationComponentProps
> = ({ activePage }) => (
  <nav className="public-account-settings-nav" aria-label="Cài đặt tài khoản">
    <NavLink
      to="/public/profile"
      className={`public-account-filter__item ${
        activePage === "profile" ? "is-active" : ""
      }`}
      aria-current={activePage === "profile" ? "page" : undefined}
    >
      Thông tin cá nhân
    </NavLink>
    <NavLink
      to="/public/change-password"
      className={`public-account-filter__item ${
        activePage === "password" ? "is-active" : ""
      }`}
      aria-current={activePage === "password" ? "page" : undefined}
    >
      Đổi mật khẩu
    </NavLink>
  </nav>
);

export default PublicAccountSettingsNavigationComponent;
