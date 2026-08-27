import AuthApiService from "../../services/api/v1/AuthApiService";
import useEntityMutation from "../../hooks/useEntityMutation";
import { Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ruleRequired } from "../../constants/rules";
import { ImageSourcePath, UserRoleValue } from "../../constants/values";
import type {
  AuthLoginRequestType,
  AuthLoginResponseType,
} from "../../types/AuthType";
import { setAccessToken } from "../../stores/accessTokenStore";

const OtherLoginPage: React.FC = () => {
  const [form] = Form.useForm<AuthLoginRequestType>();

  const loginMutation = useEntityMutation<
    AuthLoginRequestType,
    AuthLoginResponseType
  >({
    messages: {
      success: `Đăng nhập thành công!`,
      error: `Đăng nhập thất bại!`,
    },
    invalidateKeys: [["users"]],
    api: AuthApiService.handleLogin,
  });

  return (
    <div className="form">
      <h1 className="form__title">
        <img
          src={ImageSourcePath + "brand-image.png"}
          alt="brand-image"
          className="form__title-image"
        />
        <p className="form__title-text">Đăng nhập</p>
      </h1>
      <div className="form__line"></div>
      <Form
        layout="vertical"
        form={form}
        className="form__form"
        autoComplete="off"
        onFinish={async () => {
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
          );

          submitButton?.classList.add("active");

          const values = form.getFieldsValue();

          const response = await loginMutation.mutateAsync({
            values,
          });
          if (response.status === 200) {
            setAccessToken(response.data.accessToken);

            setTimeout(() => {
              const userRole = response.data.userInfo.role;

              if (userRole === UserRoleValue.admin) {
                window.location.href = "/admin";
              } else if (userRole === UserRoleValue.manager) {
                window.location.href = "/manager";
              } else if (userRole === UserRoleValue.employee) {
                window.location.href = "/employee";
              } else if (userRole === UserRoleValue.customer) {
                window.location.href = "/public";
              }
            }, 1500);
          }

          submitButton?.classList.remove("active");
        }}
      >
        <Form.Item
          name="username"
          label="Tên tài khoản"
          className="form__form-group"
          rules={[ruleRequired("Tên tài khoản không được để trống!")]}
        >
          <Input
            id="username"
            prefix={<UserOutlined />}
            placeholder="Nhập Tên tài khoản"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          className="form__form-group"
          rules={[ruleRequired("Mật khẩu không được để trống!")]}
        >
          <Input.Password
            id="password"
            prefix={<LockOutlined />}
            placeholder="Nhập Mật khẩu"
          />
        </Form.Item>
        <button type="submit" className="btn form__button">
          Xác nhận
        </button>
        <a href="" className="form__action">
          Quên mật khẩu ?
        </a>
      </Form>
    </div>
  );
};

export default OtherLoginPage;
