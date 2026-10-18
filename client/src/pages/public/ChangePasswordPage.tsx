import CheckPasswordPopoverComponent from "../../components/auth/CheckPasswordPopoverComponent";
import PublicAccountPageHeaderComponent from "../../components/pages/public/account/PublicAccountPageHeaderComponent";
import PublicAccountSettingsNavigationComponent from "../../components/pages/public/account/PublicAccountSettingsNavigationComponent";
import UserApiService from "../../services/api/v1/UserApiService";
import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Form, Input, Layout, Typography } from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import { rulePasswordStrong, ruleRequired } from "../../constants/rules";
import { openNotification } from "../../utils/showNotificationUtil";
import { openConfirmation } from "../../utils/showConfirmationUtil";
import type { ReactQueryMutationProps } from "../../constants/props";
import type { UserChangePasswordRequestType } from "../../types/UserType";
import type { CustomerInfoResponseType } from "../../types/CustomerType";

const notificationKey = "public-change-password-notification";

const PublicChangePasswordPage: React.FC = () => {
  const infoLoginRouteLoaderData = useRouteLoaderData("public-info-login");
  const infoLogin =
    infoLoginRouteLoaderData.infoLogin as CustomerInfoResponseType;

  const [form] = Form.useForm();
  const [submitFormLoading, setSubmitFormLoading] = useState<boolean>(false);
  const newPassword = Form.useWatch("newPassword", form) ?? "";

  const handleSubmitMutation = useMutation({
    mutationFn: async ({
      type,
      values,
    }: ReactQueryMutationProps<UserChangePasswordRequestType>) => {
      if (type !== "update") return;

      const res = await UserApiService.handleChangePassword({
        id: infoLogin.user?.id!,
        newPassword: values!.newPassword,
        newPassword2: values!.newPassword2,
      });

      if (res.status === 200) return res.data;
      throw new Error(String(res.data));
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
        description: "Thay đổi mật khẩu thành công!",
      });

      setTimeout(() => {
        window.location.href = "/public/change-password";
      }, 1500);
    },
    onError: (error) => {
      setSubmitFormLoading(false);
      openNotification({
        key: notificationKey,
        type: "error",
        message: "Thất bại",
        description: error ? error.message : "Thay đổi mật khẩu thất bại!",
      });
    },
  });

  return (
    <Layout className="public-account-layout">
      <div className="public-account-page public-account-page--settings">
        <PublicAccountPageHeaderComponent title="Tài khoản của tôi" />
        <Card
          styles={{ body: { padding: 0 } }}
          className="public-account-card public-account-settings-card"
        >
          <div className="public-account-card__header">
            <div>
              <Typography.Title
                level={4}
                className="public-account-card__title"
              >
                Đổi mật khẩu
              </Typography.Title>
              <Typography.Text type="secondary">
                Tạo mật khẩu mới cho tài khoản của bạn.
              </Typography.Text>
            </div>
            <PublicAccountSettingsNavigationComponent activePage="password" />
          </div>
          <div className="public-account-card__content public-account-settings-content">
            <div className="public-account-security-layout">
              <aside className="public-account-security-panel">
                <span className="public-account-security-panel__eyebrow">
                  BẢO MẬT TÀI KHOẢN
                </span>
                <Typography.Title level={3}>
                  Giữ tài khoản của bạn an toàn
                </Typography.Title>
                <Typography.Paragraph type="secondary">
                  Hãy chọn mật khẩu mạnh và không dùng lại mật khẩu đang sử dụng
                  ở dịch vụ khác.
                </Typography.Paragraph>
                <ul>
                  <li>Tối thiểu 8 ký tự</li>
                  <li>Có chữ hoa, chữ thường và chữ số</li>
                  <li>Có ít nhất một ký tự đặc biệt</li>
                </ul>
              </aside>
              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                className="public-account-security-form"
                onFinish={async (values) => {
                  const answer = await openConfirmation({
                    title: "Bạn có chắc chắn thay đổi mật khẩu?",
                    content:
                      "Bạn sẽ cần dùng mật khẩu mới ở lần đăng nhập tiếp theo.",
                  });
                  if (answer) {
                    handleSubmitMutation.mutate({
                      type: "update",
                      values,
                    });
                  }
                }}
              >
                <div className="public-account-section-heading">
                  <Typography.Title level={4}>Mật khẩu mới</Typography.Title>
                  <Typography.Text type="secondary">
                    Nhập mật khẩu mới và xác nhận lại để hoàn tất.
                  </Typography.Text>
                </div>
                <CheckPasswordPopoverComponent password={newPassword}>
                  <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      {
                        validator(_, value) {
                          if (!value) {
                            return Promise.reject(
                              new Error("Mật khẩu mới không được để trống!"),
                            );
                          }
                          return rulePasswordStrong(value).summary
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("Mật khẩu mới chưa đủ mạnh!"),
                              );
                        },
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </Form.Item>
                </CheckPasswordPopoverComponent>
                <Form.Item
                  name="newPassword2"
                  label="Xác nhận mật khẩu mới"
                  dependencies={["newPassword"]}
                  rules={[
                    ruleRequired("Vui lòng nhập lại mật khẩu!"),
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu nhập lại không khớp!"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </Form.Item>
                <div className="public-account-security-form__actions">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitFormLoading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Lưu mật khẩu mới
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default PublicChangePasswordPage;
