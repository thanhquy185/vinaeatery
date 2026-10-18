import dayjs from "dayjs";
import ProfileAvatarSectionComponent from "../../components/pages/public/profile/ProfileAvatarSectionComponent";
import ProfileInformationFieldsComponent from "../../components/pages/public/profile/ProfileInformationFieldsComponent";
import PublicAccountPageHeaderComponent from "../../components/pages/public/account/PublicAccountPageHeaderComponent";
import PublicAccountSettingsNavigationComponent from "../../components/pages/public/account/PublicAccountSettingsNavigationComponent";
import CustomerApiService from "../../services/api/v1/CustomerApiService";
import ManagerApiService from "../../services/api/v1/ManagerApiService";
import EmployeeApiService from "../../services/api/v1/EmployeeApiService";
import { useRef, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, Form, Layout, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { UserRoleValue } from "../../constants/values";
import { openConfirmation } from "../../utils/showConfirmationUtil";
import { openNotification } from "../../utils/showNotificationUtil";
import type { ReactQueryMutationProps } from "../../constants/props";
import type { ManagerUpdateRequestType } from "../../types/ManagerType";
import type { EmployeeDetailResponseType } from "../../types/EmployeeType";
import type { CustomerDetailResponseType } from "../../types/CustomerType";

const notificationKey = "public-profile-notification";

const PublicProfilePage: React.FC = () => {
  const infoLoginRouteLoaderData = useRouteLoaderData("public-info-login");
  const infoLogin =
    infoLoginRouteLoaderData.infoLogin as CustomerDetailResponseType;

  const [form] = Form.useForm();
  const [submitFormLoading, setSubmitFormLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmitMutation = useMutation({
    mutationFn: async ({
      type,
      values,
      imageFile,
    }: ReactQueryMutationProps<CustomerDetailResponseType>) => {
      if (type !== "update") return;

      const resCommon = {
        id: infoLogin.id,
        image: imageFile,
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
                description: values!.description ?? infoLogin.description,
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
              <Typography.Title level={4} className="public-account-card__title">
                Thông tin cá nhân
              </Typography.Title>
              <Typography.Text type="secondary">
                Quản lý hồ sơ và thông tin liên hệ.
              </Typography.Text>
            </div>
            <PublicAccountSettingsNavigationComponent activePage="profile" />
          </div>
          <div className="public-account-card__content public-account-settings-content">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                ...infoLogin,
                username: infoLogin.user.username,
                birthdate: infoLogin.birthdate
                  ? dayjs(infoLogin.birthdate)
                  : undefined,
              }}
              autoComplete="off"
              className="public-account-profile"
              onFinish={async (values) => {
                const answer = await openConfirmation({
                  title: "Bạn có chắc chắn cập nhật thông tin?",
                  content:
                    "Thông tin hồ sơ sẽ được cập nhật theo nội dung bạn đã nhập.",
                });
                if (answer) {
                  handleSubmitMutation.mutate({
                    type: "update",
                    values,
                    imageFile,
                  });
                }
              }}
            >
              <div className="public-account-profile__sidebar">
                <ProfileAvatarSectionComponent
                  avatarSrc={
                    imageFile && previewImage
                      ? previewImage
                      : infoLogin.imageUrl
                        ? (infoLogin.imageUrl as string)
                        : ""
                  }
                  fullname={infoLogin.fullname}
                  fileInputRef={fileInputRef}
                  onImageChange={handleChangeImage}
                  onSelectImage={() => fileInputRef.current?.click()}
                />
                <div className="public-account-profile__account-info">
                  <span>Tên đăng nhập</span>
                  <strong>{infoLogin.user.username}</strong>
                  <span>Vai trò</span>
                  <strong>{infoLogin.user.role}</strong>
                </div>
              </div>
              <ProfileInformationFieldsComponent
                submitFormLoading={submitFormLoading}
              />
            </Form>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default PublicProfilePage;
