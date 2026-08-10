import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  Layout,
  Typography,
  Row,
  Col,
  Input,
  Button,
  Form,
  Divider,
  Card,
} from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import { ruleRequired } from "../../constants/rules";

import type { ReactQueryMutationProps } from "../../constants/props";
import { openNotification } from "../../utils/showNotification";
import { openConfirmation } from "../../utils/showConfirmation";
import UserApiService from "../../services/api/v1/UserApiService";
import type { CustomerInfoResponseType } from "../../types/CustomerType";
import type { UserChangePasswordRequestType } from "../../types/UserType";

const { Title, Paragraph } = Typography;

const notificationKey = "public-change-password-notification";

// Public
const PublicChangePasswordPage = () => {
  // Load dữ liệu khách hàng đang đăng nhập
  const infoLoginRouteLoaderData = useRouteLoaderData("public-info-login");
  const infoLogin =
    infoLoginRouteLoaderData.infoLogin as CustomerInfoResponseType;

  // Biến form giữ thông tin
  const [form] = Form.useForm();
  // Biến loading cho nút submit
  const [submitFormLoading, setSubmitFormLoading] = useState<boolean>(false);
  // Mutation cho việc cập nhật thông tin
  const handleSubmitMutation = useMutation({
    mutationFn: async ({
      type,
      values,
    }: ReactQueryMutationProps<UserChangePasswordRequestType>) => {
      if (type === "update") {
        const res = await UserApiService.handleChangePassword({
          id: infoLogin.user?.id!,
          newPassword: values!.newPassword,
          newPassword2: values!.newPassword2,
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
          <Title
            level={3}
            style={{ fontWeight: 700, color: "#333", marginBottom: 30 }}
          >
            Thay đổi mật khẩu
          </Title>
          <Form
            form={form}
            layout="vertical"
            size="large"
            initialValues={{}}
            autoComplete="off"
            onFinish={async () => {
              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: `Bạn có chắc chắn thay đổi mật khẩu ?`,
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                // Danh sách dữ liệu
                const values = form.getFieldsValue();

                // Thực thi mutation
                handleSubmitMutation.mutate({
                  type: "update",
                  values: values,
                });
              }
            }}
          >
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="newPassword"
                  htmlFor="newPassword"
                  label={<span style={{ fontWeight: 600 }}>Mật khẩu mới</span>}
                  rules={[ruleRequired("Mật khẩu mới không được để trống")]}
                >
                  <Input
                    id="newPassword"
                    placeholder="Nhập Mật khẩu mới"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="newPassword2"
                  htmlFor="newPassword2"
                  label={
                    <span style={{ fontWeight: 600 }}>Nhập lại mật khẩu</span>
                  }
                  dependencies={["newPassword"]}
                  rules={[
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
                    ruleRequired("Nhập lại mật khẩu không được để trống!"),
                  ]}
                >
                  <Input
                    id="newPassword2"
                    placeholder="Nhập lại mật khẩu"
                    style={{ borderRadius: 8 }}
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

export default PublicChangePasswordPage;
