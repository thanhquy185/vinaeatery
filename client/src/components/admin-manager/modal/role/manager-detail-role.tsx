import { Form, Input, InputNumber, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { RoleType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Manager Detail Role
const ManagerDetailRole: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<RoleType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id || undefined,
          name: data?.name || undefined,
          salaryType: data?.salaryType || undefined,
          salaryValue: data?.salaryValue
            ? vietnamMoneyFormat(data?.salaryValue)
            : undefined,
          status: data?.status || undefined,
        }}
        className="modal__form split-2"
        disabled
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <Form.Item
              name="id"
              label={defaultLabels.id}
              className="modal__form-group-item"
            >
              <Input className="text-center" />
            </Form.Item>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="salaryType"
              label={defaultLabels.salaryType}
              className="modal__form-group-item margin-bottom-0"
            >
              <Select />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Select />
            </Form.Item>
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
            </Form.Item>
            <Form.Item
              name="salaryValue"
              label={defaultLabels.salaryValue}
              className="modal__form-group-item margin-bottom-0"
            >
              <InputNumber />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailRole;
