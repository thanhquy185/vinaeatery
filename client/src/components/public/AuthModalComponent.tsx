import useEntityMutation from "../../hooks/useEntityMutation";
import CheckPasswordPopoverComponent from "../CheckPasswordPopoverComponent";
import AuthApiService from "../../services/api/v1/AuthApiService";
import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Tabs } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
  ruleEmail,
  ruleRequired,
  rulePhone,
  rulePasswordStrong,
} from "../../constants/rules";
import { openNotification } from "../../utils/showNotificationUtil";
import { openConfirmation } from "../../utils/showConfirmationUtil";
import type { CustomerDetailResponseType } from "../../types/CustomerType";
import type {
  AuthCustomerRegisterRequestType,
  AuthLoginRequestType,
  AuthLoginResponseType,
} from "../../types/AuthType";

interface AuthModalComponentProps {
  isOpen: boolean;
  handleCancel: () => void;
  modalType: "login" | "signup";
  setModalType: (type: "login" | "signup") => void;
}

const AuthModalComponent: React.FC<AuthModalComponentProps> = ({
  isOpen,
  handleCancel,
  modalType,
  setModalType,
}) => {
  //
  const [formLogin] = Form.useForm();
  const [formSignup] = Form.useForm();
  const [password, setPassword] = useState<string>("");

  const loginMutation = useEntityMutation<
    AuthLoginRequestType,
    AuthLoginResponseType
  >({
    messages: {
      success: `Đăng nhập thành công!`,
      error: `Đăng nhập thất bại!`,
    },
    invalidateKeys: [["login"]],
    api: AuthApiService.handleLogin,
  });
  const signupMutation = useEntityMutation<
    AuthCustomerRegisterRequestType,
    CustomerDetailResponseType
  >({
    messages: {
      success: `Đăng ký thành công!`,
      error: `Đăng ký thất bại!`,
    },
    invalidateKeys: [["signup"]],
    api: AuthApiService.handleCustomerRegister,
  });

  // Form đăng nhập
  const LoginForm = () => (
    <Form
      form={formLogin}
      name="login"
      layout="vertical"
      initialValues={{
        username: undefined,
        password: undefined,
      }}
      autoComplete="off"
      onFinish={async () => {
        const values = formLogin.getFieldsValue();

        const data = await loginMutation.mutateAsync({
          values: values,
        });
        if (data) {
          window.location.href = "/public";
        }
      }}
    >
      <Form.Item
        label="Tên tài khoản"
        name="username"
        rules={[ruleRequired("Tên tài khoản không được để trống!")]}
        style={{ fontSize: 16 }}
      >
        <Input placeholder="Nhập Tên tài khoản" style={{ height: 40 }} />
      </Form.Item>
      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[ruleRequired("Mật khẩu không được để trống!")]}
        style={{ marginTop: 30 }}
      >
        <Input.Password placeholder="Nhập Mật khẩu" style={{ height: 40 }} />
      </Form.Item>
      <Form.Item style={{ marginTop: 40, marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          className="bg-red-600 hover:bg-red-700 border-none font-semibold!"
          style={{ height: 40 }}
        >
          ĐĂNG NHẬP
        </Button>
      </Form.Item>
      <div className="flex justify-start">
        <a
          href="#"
          className="text-xl text-gray-500! hover:text-red-700! mt-2!"
        >
          Quên Mật khẩu?
        </a>
      </div>
    </Form>
  );
  // Form đăng ký
  const SignupForm = () => (
    <Form
      form={formSignup}
      name="register"
      layout="vertical"
      initialValues={{
        customerFullname: undefined,
        customerPhone: undefined,
        customerEmail: undefined,
        username: undefined,
        password: undefined,
        password2: undefined,
      }}
      autoComplete="off"
      scrollToFirstError
      onFinish={async () => {
        const values = formSignup.getFieldsValue();

        // Kiểm tra mật khẩu và mật khẩu lần 2 có khớp không
        if (values.password !== values.password2) {
          openNotification({
            type: "warning",
            message: "Cảnh báo",
            description: "Mật khẩu và Mật khẩu lần 2 không khớp!",
          });

          return;
        }

        const answer = await openConfirmation({
          title: `Bạn có chắc chắn đăng ký ?`,
          content: "Hãy kiểm tra lại thông trước khi xác nhận.",
        });
        if (answer) {
          const values = formSignup.getFieldsValue();

          const data = await signupMutation.mutateAsync({
            values: values,
          });
          if (data) {
            formSignup.resetFields();
            handleTabChange("login");
          }
        }
      }}
    >
      <Row className="flex gap-8">
        <Col className="flex-1">
          <Form.Item
            label="Họ và Tên"
            name="customerFullname"
            rules={[ruleRequired("Họ và tên không được để trống!")]}
          >
            <Input placeholder="Nhập Họ và tên" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="customerPhone"
            rules={[
              ruleRequired("Số điện thoại không được để trống!"),
              rulePhone(),
            ]}
            style={{ marginTop: 30 }}
          >
            <Input placeholder="Nhập Số điện thoại" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="customerEmail"
            rules={[ruleRequired("Email không được để trống!"), ruleEmail()]}
            style={{ marginTop: 30 }}
          >
            <Input placeholder="Nhập Email" style={{ height: 40 }} />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item
            label="Tên tài khoản"
            name="username"
            rules={[
              {
                required: true,
                message: "Tên tài khoản không được để trống!",
              },
            ]}
          >
            <Input placeholder="Nhập Tên tài khoản" style={{ height: 40 }} />
          </Form.Item>
          <CheckPasswordPopoverComponent
            password={password}
            children={
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    validator(_, value) {
                      if (!value)
                        return Promise.reject("Mật khẩu không được để trống!");

                      const isStrong = rulePasswordStrong(value).summary;

                      return isStrong
                        ? Promise.resolve()
                        : Promise.reject("Mật khẩu chưa đủ mạnh!");
                    },
                  },
                ]}
                required
                style={{ marginTop: 30 }}
              >
                <Input
                  placeholder="Nhập mật khẩu"
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ height: 40 }}
                />
              </Form.Item>
            }
          />
          <Form.Item
            name="password2"
            label="Mật khẩu lần 2"
            dependencies={["password"]}
            rules={[
              ruleRequired("Mật khẩu lần 2 không được để trống!"),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();

                  if (value !== getFieldValue("password")) {
                    return Promise.reject(
                      "Mật khẩu xác nhận không trùng khớp!",
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
            style={{ marginTop: 30 }}
          >
            <Input placeholder="Nhập mật khẩu lần 2" style={{ height: 40 }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          className="bg-red-600 hover:bg-red-700 border-none font-semibold!"
          style={{ height: 40 }}
        >
          ĐĂNG KÝ
        </Button>
      </Form.Item>
      {/* --- Phần Social Login --- */}
      <div className="text-center mt-10!">
        <div className="relative flex items-center justify-center">
          <hr className="absolute w-full border-t border-gray-300" />
          <span className="relative z-10 bg-white px-3 text-gray-500 text-xl mb-4!">
            Hoặc tiếp tục bằng
          </span>
        </div>
      </div>
      <div className="flex gap-6 mt-2!">
        {/* Nút Đăng ký bằng Google */}
        <Button
          block
          icon={<FontAwesomeIcon icon={faGoogle} />}
          className="flex items-center justify-center border-gray-300 text-gray-700 font-medium hover:!border-red-600 hover:!text-red-600"
          style={{ height: 40 }}
          onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/google")
          }
        >
          Đăng ký với Google
        </Button>
        {/* Nút Đăng ký bằng Facebook */}
        <Button
          block
          icon={<FontAwesomeIcon icon={faFacebookF} />}
          className="flex items-center justify-center border-gray-300 text-gray-700 font-medium hover:!border-red-600 hover:!text-red-600"
          style={{ height: 40 }}
          onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/facebook")
          }
        >
          Đăng ký với Facebook
        </Button>
      </div>
    </Form>
  );

  // Các tabs
  const items = [
    {
      key: "login",
      label: <span className="text-2xl font-semibold">Đăng Nhập</span>,
      children: LoginForm(),
    },
    {
      key: "signup",
      label: <span className="text-2xl font-semibold">Đăng Ký</span>,
      children: SignupForm(),
    },
  ];
  // Thay đổi tab khi người dùng click
  const handleTabChange = (key: string) => {
    setModalType(key as "login" | "signup");
  };

  useEffect(() => {
    formLogin.resetFields();
    formSignup.resetFields();
  }, [isOpen, modalType]);

  return (
    <Modal
      open={isOpen}
      title={null}
      footer={null}
      onCancel={handleCancel}
      width={modalType === "login" ? 450 : 800}
      centered
    >
      <div className="p-4">
        {/* Logo/Header trong Modal */}
        <h2 className="text-4xl font-extrabold text-red-700 text-center mb-6!">
          Chào mừng bạn đến với VINAEATERY
        </h2>
        {/* Tabs cho Đăng nhập/Đăng ký */}
        <Tabs
          defaultActiveKey={modalType}
          activeKey={modalType}
          onChange={handleTabChange}
          centered
          items={items}
          className="auth-tabs mb-4"
        />
      </div>
    </Modal>
  );
};

export default AuthModalComponent;
