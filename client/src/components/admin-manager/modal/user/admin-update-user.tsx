import { Form, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { UserType } from "../../../../common/types";
import {
  ModalAutoComplete,
  ModalLayout,
  UserRoleValue,
} from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateUser } from "../../../../requests/users";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Admin Update User
const AdminUpdateUser: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  closeModal,
}) => {
  const [form] = Form.useForm<UserType>();
  const updateMutation = useEntityMutation<UserType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateUser,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id || undefined,
          role: data?.role || undefined,
        }}
        className="modal__form split-1"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn cập nhật ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await updateMutation.mutateAsync({
              values: {
                ...values,
                role: values!.role || undefined,
                // method: values!.method || undefined,
                updateAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
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
              name="id"
              className="modal__form-group-item none"
            ></Form.Item>
            <Form.Item
              name="role"
              label={defaultLabels.role}
              className="modal__form-group-item"
              rules={[ruleRequired("Quyền hạn không được để trống!")]}
            >
              <Select
                allowClear
                placeholder={defaultInputs.role}
                options={[
                  {
                    label: UserRoleValue.manager,
                    value: UserRoleValue.manager,
                  },
                  {
                    label: UserRoleValue.customer,
                    value: UserRoleValue.customer,
                  },
                ]}
              />
            </Form.Item>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default AdminUpdateUser;
