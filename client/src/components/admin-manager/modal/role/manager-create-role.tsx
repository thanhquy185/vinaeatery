import { Form, Input, InputNumber, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { RoleType } from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
  RoleSalaryType,
} from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateRole } from "../../../../requests/roles";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Create Role
const ManagerCreateRole: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<RoleType>();
  const createMutation = useEntityMutation<RoleType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateRole,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
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
                restaurantId: restaurantId,
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
            <Form.Item
              name="id"
              label={defaultLabels.id}
              className="modal__form-group-item"
            >
              <Input
                className="text-center"
                placeholder={defaultInputs.id}
                disabled
              />
            </Form.Item>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Tên chức vụ không được để trống!")]}
            >
              <Input placeholder={defaultInputs.name} />
            </Form.Item>
            <Form.Item
              name="salaryType"
              label={defaultLabels.salaryType}
              className="modal__form-group-item"
              rules={[ruleRequired("Trạng thái không được để trống!")]}
            >
              <Select
                allowClear
                placeholder={defaultInputs.salaryType}
                options={[
                  {
                    label: RoleSalaryType.fixed,
                    value: RoleSalaryType.fixed,
                  },
                  {
                    label: RoleSalaryType.hours,
                    value: RoleSalaryType.hours,
                  },
                ]}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
              rules={[ruleRequired("Trạng thái không được để trống!")]}
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
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
            </Form.Item>
            <Form.Item
              name="salaryValue"
              label={defaultLabels.salaryValue}
              className="modal__form-group-item"
              rules={[ruleRequired("Tiền lương không được để trống!")]}
            >
              <InputNumber min={0} placeholder={defaultInputs.salaryValue} />
            </Form.Item>
          </div>
        </div>
        <div className="modal__buttons">
          <button type="submit" className="modal__button btn create">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerCreateRole;
