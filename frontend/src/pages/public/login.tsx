import { useNavigate } from 'react-router-dom';
import { Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ruleRequired } from "../../common/rules";
import { HandleLogin } from '../../services/api';
import { openNotification } from '../../utils/showNotification';

// Login Page
const LoginPage = () => {
  //
  const navigate = useNavigate();

  //
  const [form] = Form.useForm();

  return (
    <>
      {/* <ComebackHomeButton /> */}
      <div className="form">
        <h1 className="form__title">
          <img src="src/assets/images/others/brand-image.png" alt="brand-image" className="form__title-image" />
          <p className="form__title-text">Đăng nhập</p>
        </h1>
        <div className="form__line"></div>
        <Form
          layout="vertical"
          form={form}
          className="form__form"
          autoComplete='off'
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Gọi api xử lý
            const res = await HandleLogin({
              username: values!.username || undefined,
              password: values!.password || undefined,
            });
            if (res.status === 200) {
              openNotification({
                type: "success",
                message: "Thành công",
                description: "Đăng nhập thành công !",
                duration: 1.5,
              });

              setTimeout(() => {
                // navigate("/admin");
                window.location.href = "/admin";
              }, 1500);
            } else {
              openNotification({
                type: "error",
                message: "Thất bại",
                description: res!.data ? String(res!.data) : "Đăng nhập thất bại !",
                duration: 1.5,
              });

              setTimeout(() => {
                // Xoá class 'active' thể hiện nút không còn được nhấn
                submitButton?.classList.remove("active");
              }, 1500);
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <Form.Item
            name="username"
            label="Tên tài khoản"
            htmlFor="username"
            className="form__form-group"
            rules={[ruleRequired("Tên tài khoản không được để trống !")]}
          >
            <Input id="username" prefix={<UserOutlined />} placeholder="Nhập Tên tài khoản" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            htmlFor="password"
            className="form__form-group"
            rules={[ruleRequired("Mật khẩu không được để trống !")]}
          >
            <Input.Password id="password" prefix={<LockOutlined />} placeholder="Nhập Mật khẩu" />
          </Form.Item>
          <button type="submit" className="btn form__button">
            Xác nhận
          </button>
          <a href="" className="form__action">Quên mật khẩu ?</a>
        </Form>
      </div >
    </>
  );
};

export default LoginPage;
