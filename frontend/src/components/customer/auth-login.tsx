import { Button, Col, Form, Input, Modal, Row, Tabs } from "antd";
import { ruleEmail, rulePhone, ruleRequired } from "../../common/rules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import CustomSpinner from "../common/spinner";
import { useEffect, useState } from "react";
import { HandleLogin, HandleSignUp } from "../../services/api";
import { openNotification } from "../../utils/showNotification";
import { h } from "@fullcalendar/core/preact.js";
import { useNavigate } from "react-router-dom";
import { openConfirmation } from "../../utils/showConfirmation";
import dayjs from "dayjs";

// Giao diện chung cho Modal
interface AuthModalProps {
  isOpen: boolean;
  handleCancel: () => void;
  modalType: "login" | "signup";
  setModalType: (type: "login" | "signup") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  handleCancel,
  modalType,
  setModalType,
}) => {
  const navigate = useNavigate();

  //
  const [isShowSpinner, setIsShowSpinner] = useState<boolean>(false);

  //
  const [formLogin] = Form.useForm();
  const [formSignup] = Form.useForm();
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
        // Danh sách dữ liệu
        const values = formLogin.getFieldsValue();

        // Gọi api xử lý
        setIsShowSpinner(true);
        const res = await HandleLogin({
          username: values!.username || undefined,
          password: values!.password || undefined,
        });
        if (res.status === 200) {
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Đăng nhập thành công!",
            duration: 1.5,
          });

          setTimeout(() => {
            // navigate("/public")
            window.location.href = "/public";
            handleCancel();
          }, 1500);
        } else {
          openNotification({
            type: "error",
            message: "Thất bại",
            description: res!.data ? String(res!.data) : "Đăng nhập thất bại!",
            duration: 1.5,
          });
        }

        setIsShowSpinner(false);
      }}
    >
      <Form.Item
        label="Tên tài khoản"
        name="username"
        rules={[ruleRequired("Tên tài khoản không được để trống !")]}
        style={{ fontSize: 16 }}
      >
        <Input placeholder="Nhập Tên tài khoản" style={{ height: 40 }} />
      </Form.Item>
      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[ruleRequired("Mật khẩu không được để trống !")]}
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
        fullname: undefined,
        phone: undefined,
        email: undefined,
        username: undefined,
        password: undefined,
        authPassword: undefined,
      }}
      autoComplete="off"
      scrollToFirstError
      onFinish={async () => {
        // Danh sách dữ liệu
        const values = formSignup.getFieldsValue();

        // Kiểm tra mật khẩu và mật khẩu lần 2 có khớp không
        if (values!.password !== values!.authPassword) {
          openNotification({
            type: "warning",
            message: "Cảnh báo",
            description: "Mật khẩu và Mật khẩu lần 2 không khớp !",
            duration: 1.5,
          });

          return;
        }
        // Hỏi trước khi xử khi xử lý ?
        const answer = await openConfirmation({
          title: `Bạn có chắc chắn đăng ký ?`,
          content: "Hãy kiểm tra lại thông trước khi xác nhận.",
        });
        if (answer) {
          // Gọi api xử lý
          setIsShowSpinner(true);
          const res = await HandleSignUp({
            createAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            fullname: values!.fullname || undefined,
            phone: values!.phone || undefined,
            email: values!.email || undefined,
            username: values!.username || undefined,
            password: values!.password || undefined,
            authPassword: values!.authPassword || undefined,
          });
          if (res.status === 200) {
            openNotification({
              type: "success",
              message: "Thành công",
              description: "Đăng ký thành công!",
              duration: 1.5,
            });

            setTimeout(() => {
              setModalType("login");
            }, 1500);
          } else {
            openNotification({
              type: "error",
              message: "Thất bại",
              description: res!.data ? String(res!.data) : "Đăng ký thất bại!",
              duration: 1.5,
            });
          }

          setIsShowSpinner(false);
        }
      }}
    >
      <Row className="flex gap-8">
        <Col className="flex-1">
          <Form.Item
            label="Họ và Tên"
            name="fullname"
            rules={[ruleRequired("Họ và tên không được để trống !")]}
          >
            <Input placeholder="Nhập Họ và tên" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              ruleRequired("Số điện thoại không được để trống !"),
              rulePhone(),
            ]}
            style={{ marginTop: 30 }}
          >
            <Input placeholder="Nhập Số điện thoại" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[ruleRequired("Email không được để trống !"), ruleEmail()]}
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
                message: "Tên tài khoản không được để trống !",
              },
            ]}
          >
            <Input placeholder="Nhập Tên tài khoản" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[ruleRequired("Mật khẩu không được để trống !")]}
            style={{ marginTop: 30 }}
          >
            <Input placeholder="Nhập Mật khẩu" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item
            label="Mật khẩu lần 2"
            name="authPassword"
            rules={[ruleRequired("Mật khẩu lần 2 không được để trống !")]}
            style={{ marginTop: 30 }}
          >
            <Input placeholder="Nhập Mật khẩu lần 2" style={{ height: 40 }} />
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
  //
  useEffect(() => {
    formLogin.resetFields();
    formSignup.resetFields();
  }, [isOpen, modalType]);

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

  return (
    <>
      {isShowSpinner && <CustomSpinner />}
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
    </>
  );
};

export default AuthModal;
