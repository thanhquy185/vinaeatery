import { Form, Input } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { EmployeeType } from "../../../../common/types";
import { ruleRequired } from "../../../../common/rules";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleChangePasswordUser } from "../../../../requests/users";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Change Password
const ManagerChangePassword: React.FC<CrudObjectModalProps> = ({
  objectEN,
  fieldId,
  closeModal,
}) => {
  const [form] = Form.useForm<EmployeeType>();
  const changePasswordMutation = useEntityMutation<any>({
    messages: {
      success: `Thay đổi mật khẩu thành công!`,
      error: `Thay đổi mật khẩu thất bại!`,
    },
    invalidateKeys: [],
    api: HandleChangePasswordUser,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        className="modal__form"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn cập nhập ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await changePasswordMutation.mutateAsync({
              values: {
                ...values,
                id: fieldId,
              },
            });
            if (response) {
              closeModal();
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }

          // Xoá class 'active' thể hiện nút không còn được nhấn
          submitButton?.classList.remove("active");
        }}
      >
        <div className="modal__form-group-warper">
          <div className="modal__form-group">
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              htmlFor="new-password"
              className="modal__form-group-item"
              rules={[ruleRequired("Mật khẩu mới không được để trống!")]}
            >
              <Input id="new-password" placeholder="Nhập Mật khẩu mới" />
            </Form.Item>
            <Form.Item
              name="authNewPassword"
              label="Xác nhận mật khẩu mới"
              htmlFor="auth-new-password"
              className="modal__form-group-item"
              rules={[
                ruleRequired("Xác nhận mật khẩu mới không được để trống!"),
              ]}
            >
              <Input
                id="auth-new-password"
                placeholder="Nhập Xác nhận mật khẩu mới"
              />
            </Form.Item>
          </div>
        </div>
        <div className="modal__buttons">
          <button type="submit" className="modal__button btn">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerChangePassword;
