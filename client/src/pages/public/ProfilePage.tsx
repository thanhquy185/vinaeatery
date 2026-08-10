import ManagerApiService from "../../services/api/v1/ManagerApiService";
import CustomerApiService from "../../services/api/v1/CustomerApiService";
import EmployeeApiService from "../../services/api/v1/EmployeeApiService";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  Layout,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Button,
  Form,
  DatePicker,
  Avatar,
  Divider,
  Card,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CameraOutlined,
  SaveOutlined,
  DownCircleOutlined,
  KeyOutlined,
  SettingOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ruleEmail, rulePhone, ruleRequired } from "../../constants/rules";
import {
  CommonGenderValue,
  ImageSourcePath,
  UserRoleValue,
} from "../../constants/values";
import { openConfirmation } from "../../utils/showConfirmation";
import { openNotification } from "../../utils/showNotification";
import type { ReactQueryMutationProps } from "../../constants/props";
import type { ManagerUpdateRequestType } from "../../types/ManagerType";
import type { EmployeeDetailResponseType } from "../../types/EmployeeType";
import type { CustomerDetailResponseType } from "../../types/CustomerType";

const notificationKey = "public-profile-notification";

const PublicProfilePage: React.FC = ({}) => {
  // Load dữ liệu khách hàng đang đăng nhập
  const infoLoginRouteLoaderData = useRouteLoaderData("public-info-login");
  const infoLogin =
    infoLoginRouteLoaderData.infoLogin as CustomerDetailResponseType;

  // Biến form giữ thông tin
  const [form] = Form.useForm();
  // Biến loading cho nút submit
  const [submitFormLoading, setSubmitFormLoading] = useState<boolean>(false);
  // Các biến liên quan đến thay đổi ảnh đại diện
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();

  // Hàm xử lý khi thay đổi ảnh đại diện
  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Lấy url ảnh để preview
    const imageURL = URL.createObjectURL(file);

    // Cập nhật giá trị
    setImageFile(file);
    setPreviewImage(imageURL);
  };

  // Mutation cho việc cập nhật thông tin
  const handleSubmitMutation = useMutation({
    mutationFn: async ({
      type,
      values,
      imageFile,
    }: ReactQueryMutationProps<CustomerDetailResponseType>) => {
      if (type === "update") {
        const resCommon = {
          id: infoLogin.id,
          image: imageFile!,
          fullname: values!.fullname,
          birthdate:
            values!.birthdate && dayjs(values!.birthdate).isValid()
              ? dayjs(values!.birthdate).format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD"),
          gender: values!.gender,
          phone: values!.phone,
          email: values!.email,
          houseNumber: values!.houseNumber,
          streetName: values!.streetName,
          ward: values!.ward,
          province: values!.province,
        };

        const res =
          infoLogin.user.role === UserRoleValue.manager
            ? await ManagerApiService.handleUpdate(
                resCommon as unknown as ManagerUpdateRequestType,
              )
            : infoLogin.user.role === UserRoleValue.employee
              ? await EmployeeApiService.handleUpdate({
                  ...resCommon,
                  description: (
                    infoLogin as unknown as EmployeeDetailResponseType
                  ).description,
                  roleId: (infoLogin as unknown as EmployeeDetailResponseType)
                    .role.id,
                  permissionId: (
                    infoLogin as unknown as EmployeeDetailResponseType
                  ).permission.id,
                })
              : await CustomerApiService.handleUpdate({
                  ...resCommon,
                  description: values!.description,
                });

        if (res.status === 200) {
          return res.data;
        }
        {
          throw new Error(String(res.data));
        }
      }
    },
    onMutate: () => {
      setSubmitFormLoading(true);
      openNotification({
        key: notificationKey,
        type: "info",
        icon: <LoadingOutlined />,
        message: "Đang xử lý...",
        description: "Vui lòng chờ giây lát",
        duration: null,
      });
    },
    onSuccess: () => {
      setSubmitFormLoading(false);
      openNotification({
        key: notificationKey,
        type: "success",
        message: "Thành công",
        description: "Cập nhật thông tin thành công!",
      });

      setTimeout(() => {
        window.location.href = "/public/profile";
      }, 1500);
    },
    onError: (error) => {
      setSubmitFormLoading(false);
      openNotification({
        key: notificationKey,
        type: "error",
        message: "Thất bại",
        description: error ? error.message : "Cập nhật thông tin thất bại!",
      });

      setTimeout(() => {}, 1500);
    },
  });

  return (
    <Layout
      style={{ minHeight: "calc(100vh - 90px)", backgroundColor: "#f4f6fa" }}
    >
      <div className="flex justify-center container mx-auto sm:px-6 lg:px-8 py-8 py-14!">
        <Card
          style={{
            width: 900,
            padding: 8,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Typography.Title
            level={3}
            style={{ fontWeight: 700, color: "#333", marginBottom: 30 }}
          >
            Thông tin người dùng
          </Typography.Title>
          <Form
            form={form}
            layout="vertical"
            size="large"
            initialValues={{
              ...infoLogin,
              username: infoLogin.user.username,
              birthdate: dayjs(infoLogin.birthdate),
            }}
            autoComplete="off"
            onFinish={async () => {
              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: `Bạn có chắc chắn cập nhật thông tin ?`,
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                // Danh sách dữ liệu
                const values = form.getFieldsValue();

                // Thực thi mutation
                handleSubmitMutation.mutate({
                  type: "update",
                  values: values,
                  imageFile: imageFile,
                });
              }
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                size={90}
                src={
                  imageFile && previewImage
                    ? previewImage
                    : infoLogin.image
                      ? (infoLogin.image as string)
                      : ImageSourcePath + "no-image.png"
                }
                icon={<UserOutlined />}
                style={{ border: "1px solid #dedede", marginRight: 20 }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleChangeImage}
              />
              <div>
                <Typography.Paragraph
                  strong
                  style={{ margin: 0, fontSize: 18 }}
                >
                  {infoLogin.fullname}
                </Typography.Paragraph>
                <Button
                  type="default"
                  icon={<CameraOutlined />}
                  style={{ marginTop: 8, borderRadius: 8, fontSize: 15 }}
                  onClick={() => fileInputRef?.current?.click()}
                >
                  Thay đổi ảnh
                </Button>
              </div>
            </div>
            <Divider />
            <Typography.Paragraph
              strong
              style={{ color: "#b91c1c", fontSize: 18 }}
            >
              Thông tin cá nhân
            </Typography.Paragraph>
            <Row gutter={28}>
              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="fullname"
                  htmlFor="fullname"
                  label={<span style={{ fontWeight: 600 }}>Họ và tên</span>}
                  rules={[ruleRequired("Họ và tên không được để trống!")]}
                >
                  <Input
                    id="fullname"
                    prefix={
                      <UserOutlined style={{ color: "#ccc", marginRight: 4 }} />
                    }
                    placeholder="Nhập Họ và Tên"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="birthdate"
                  htmlFor="birthdate"
                  label={<span style={{ fontWeight: 600 }}>Ngày sinh</span>}
                >
                  <DatePicker
                    id="birthdate"
                    allowClear
                    format="YYYY-MM-DD"
                    prefix={
                      <CalendarOutlined
                        style={{ color: "#ccc", marginRight: 4 }}
                      />
                    }
                    suffixIcon={null}
                    style={{ width: "100%", borderRadius: 8 }}
                    placeholder="Chọn Ngày sinh"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="gender"
                  htmlFor="gender"
                  label={<span style={{ fontWeight: 600 }}>Giới tính</span>}
                >
                  <Select
                    id="gender"
                    allowClear
                    prefix={
                      <DownCircleOutlined
                        style={{ color: "#ccc", marginRight: 4 }}
                      />
                    }
                    suffixIcon={null}
                    options={[
                      {
                        label: CommonGenderValue.male,
                        value: CommonGenderValue.male,
                      },
                      {
                        label: CommonGenderValue.female,
                        value: CommonGenderValue.female,
                      },
                    ]}
                    placeholder="Chọn Giới tính"
                    style={{ borderRadius: 8 }}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={12} style={{ marginTop: 14 }}>
                <Form.Item
                  hasFeedback
                  name="phone"
                  htmlFor="phone"
                  label={<span style={{ fontWeight: 600 }}>Số điện thoại</span>}
                  rules={[
                    ruleRequired("Số điện thoại không được để trống"),
                    rulePhone(),
                  ]}
                >
                  <Input
                    id="phone"
                    prefix={
                      <PhoneOutlined
                        style={{ color: "#ccc", marginRight: 4 }}
                      />
                    }
                    placeholder="Nhập Số điện thoại"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} style={{ marginTop: 14 }}>
                <Form.Item
                  hasFeedback
                  name="email"
                  htmlFor="email"
                  label={<span style={{ fontWeight: 600 }}>Email</span>}
                  rules={[
                    ruleRequired("Email không được để trống!"),
                    ruleEmail(),
                  ]}
                >
                  <Input
                    id="email"
                    prefix={
                      <MailOutlined style={{ color: "#ccc", marginRight: 4 }} />
                    }
                    placeholder="Nhập Email"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} style={{ marginTop: 14 }}>
                <Form.Item
                  name="address"
                  htmlFor="address"
                  label={<span style={{ fontWeight: 600 }}>Địa chỉ</span>}
                >
                  <Input
                    id="address"
                    prefix={
                      <EnvironmentOutlined
                        style={{ color: "#ccc", marginRight: 4 }}
                      />
                    }
                    placeholder="Nhập Địa chỉ"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Typography.Paragraph
              strong
              style={{ color: "#b91c1c", fontSize: 18 }}
            >
              Thông tin tài khoản
            </Typography.Paragraph>
            <Row gutter={28}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label={<span style={{ fontWeight: 600 }}>Tên tài khoản</span>}
                >
                  <Input
                    prefix={
                      <SettingOutlined
                        style={{ color: "#ccc", marginRight: 4 }}
                      />
                    }
                    style={{ borderRadius: 8 }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>}
                >
                  <Input
                    prefix={
                      <KeyOutlined style={{ color: "#ccc", marginRight: 4 }} />
                    }
                    placeholder="Mật khẩu đã được mã hoá"
                    style={{ borderRadius: 8 }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Form.Item style={{ marginTop: 30, marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitFormLoading}
                icon={<SaveOutlined />}
                style={{
                  width: "100%",
                  borderRadius: 8,
                  height: 40,
                  fontWeight: 600,
                }}
              >
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default PublicProfilePage;
