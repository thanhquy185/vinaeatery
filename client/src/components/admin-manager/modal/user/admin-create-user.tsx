import { DatePicker, Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { UserType } from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
  UserIsUsingValue,
  UserMethodValue,
  UserRoleValue,
} from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateUser } from "../../../../requests/users";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Admin Create User
const AdminCreateUser: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  closeModal,
}) => {
  const [form] = Form.useForm<UserType>();
  const createMutation = useEntityMutation<UserType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateUser,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          createAt: dayjs(),
          method: UserMethodValue.handmade,
          isUsing: UserIsUsingValue.notUsing,
        }}
        className="modal__form split-2"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn thêm ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await createMutation.mutateAsync({
              values: {
                ...values,
                createAt:
                  values?.createAt && dayjs(values?.createAt).isValid()
                    ? dayjs(values?.createAt).format("YYYY-MM-DD HH:mm:ss")
                    : undefined,
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
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input
                  placeholder={defaultInputs.id}
                  className="text-center"
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <DatePicker format="YYYY-MM-DD HH:mm:ss" disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="isUsing"
                label={defaultLabels.isUsing}
                className="modal__form-group-item"
              >
                <Select placeholder={defaultInputs.isUsing} disabled />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
                rules={[ruleRequired("Cần chọn Trạng thái!")]}
              >
                <Select
                  allowClear
                  placeholder={defaultInputs.status}
                  options={[
                    {
                      label: CommonStatus.active,
                      value: CommonStatus.active,
                    },
                    {
                      label: CommonStatus.inactive,
                      value: CommonStatus.inactive,
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="username"
              label={defaultLabels.username}
              className="modal__form-group-item"
              rules={[ruleRequired("Tên tài khoản không được để trống!")]}
            >
              <Input placeholder={defaultInputs.username} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="method"
              label={defaultLabels.method}
              className="modal__form-group-item"
            >
              <Select placeholder={defaultInputs.method} disabled />
            </Form.Item>
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
            <Form.Item
              name="password"
              label={defaultLabels.password}
              className="modal__form-group-item"
              rules={[ruleRequired("Mật khẩu không được để trống!")]}
            >
              <Input placeholder={defaultInputs.password} />
            </Form.Item>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default AdminCreateUser;
