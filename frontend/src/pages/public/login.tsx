import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import ComebackHomeButton from "../../components/common/comeback-home-button";

const LoginPage = () => {
  // Biến chứa giá trị cho việc hiển thị hay ẩn mật khẩu
  const [showPassword, setShowPassword] = useState<Boolean>(false);

  return (
    <>
      {/* <ComebackHomeButton /> */}
      <div className="form">
        <h1 className="form__title">Đăng nhập</h1>
        <div className="form__line"></div>
        <form id="login-form" autoComplete="on">
          <div className="form__form-group">
            <label htmlFor="login-username">Tên tài khoản</label>
            <input
              name="username"
              type="text"
              id="login-username"
              placeholder="Nhập tên tài khoản"
            />
            <FontAwesomeIcon icon={faCircleInfo} className="error-icon" />
            <p id="error-username" className="error-text"></p>
          </div>
          <div className="form__form-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              name="password"
              type={!showPassword ? "password" : "text"}
              id="login-password"
              placeholder="Nhập mật khẩu"
            />
            <FontAwesomeIcon icon={faCircleInfo} className="error-icon" />
            <p id="error-password" className="error-text"></p>
            {!showPassword ? (
              <FontAwesomeIcon
                icon={faEye}
                className="icon"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <FontAwesomeIcon
                icon={faEyeSlash}
                className="icon"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>
          <div className="form__form-group">
            <button type="submit" className="btn">
              Xác nhận
            </button>
          </div>
          <p className="form__action left">
            <a href="#!">Quên mật khẩu</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
