import useEntityMutation from "../../../../hooks/useEntityMutation";
import CheckPasswordListComponent from "../../../CheckPasswordListComponent";
import UserApiService from "../../../../services/api/v1/UserApiService";
import { useState } from "react";
import { Form, Input } from "antd";
import { rulePasswordStrong, ruleRequired } from "../../../../constants/rules";
import { ModalAutoComplete, ModalLayout } from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  UserChangePasswordRequestType,
  UserDetailResponseType,
} from "../../../../types/UserType";

const ChangePasswordUserModalComponent: React.FC<CrudObjectModalProps> = ({
  fieldId,
  closeModal,
}) => {
  const [form] = Form.useForm<UserChangePasswordRequestType>();
  const [newPassword, setNewPassword] = useState<string>("");

  const changePasswordMutation = useEntityMutation<
    UserChangePasswordRequestType,
    UserDetailResponseType
  >({
    messages: {
      success: `Thay đổi mật khẩu thành công!`,
      error: `Thay đổi mật khẩu thất bại!`,
    },
    invalidateKeys: [],
    api: UserApiService.handleChangePassword,
  });

  return (
    <Form
      form={form}
      layout={ModalLayout}
      autoComplete={ModalAutoComplete}
      className="modal__form"
      onFinish={async () => {
        const submitButton = document.querySelector(
          ".modal__form button[type='submit']",
        );

        submitButton?.classList.add("active");

        const answer = await openConfirmation({
          title: `Bạn có chắc chắn cập nhập ?`,
          content: "Hành động này không thể hoàn tác.",
        });
        if (answer) {
          const values = form.getFieldsValue();

          const response = await changePasswordMutation.mutateAsync({
            values: {
              ...values,
              id: fieldId!,
            },
          });
          if (response) {
            closeModal();
          }
        }

        submitButton?.classList.remove("active");
      }}
    >
      <div className="modal__form-group-warper">
        <div className="modal__form-group">
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                validator(_, value) {
                  if (!value)
                    return Promise.reject("Mật khẩu mới không được để trống!");

                  const isStrong = rulePasswordStrong(value).summary;

                  return isStrong
                    ? Promise.resolve()
                    : Promise.reject("Mật khẩu mới chưa đủ mạnh!");
                },
              },
            ]}
            required
          >
            <Input
              placeholder="Nhập mật khẩu mới"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <CheckPasswordListComponent password={newPassword} />
          <Form.Item
            name="newPassword2"
            label="Mật khẩu mới lần 2"
            dependencies={["newPassword"]}
            rules={[
              ruleRequired("Mật khẩu mới lần 2 không được để trống!"),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();

                  if (value !== getFieldValue("newPassword")) {
                    return Promise.reject(
                      "Mật khẩu xác nhận không trùng khớp!",
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Nhập mật khẩu mới lần 2" />
          </Form.Item>
        </div>
      </div>
      <div className="modal__buttons">
        <button type="submit" className="modal__button btn">
          Xác nhận
        </button>
      </div>
    </Form>
  );
};

export default ChangePasswordUserModalComponent;
