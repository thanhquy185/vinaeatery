import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { SupplierType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";

// Manager Detail Supplier
const ManagerDetailSupplier: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<SupplierType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id! || undefined,
          name: data?.name! || undefined,
          phone: data?.phone! || undefined,
          email: data?.email! || undefined,
          address: data?.address! || undefined,
          status: data?.status! || undefined,
        }}
        disabled
        className="modal__form split-2"
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <Form.Item
              name="id"
              label={defaultLabels.id}
              className="modal__form-group-item"
            >
              <Input className="text-center" disabled />
            </Form.Item>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="phone"
              label={defaultLabels.phone}
              className="modal__form-group-item"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="address"
              label={defaultLabels.address}
              className="modal__form-group-item multiple-2 margin-bottom-0"
            >
              <Input disabled />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Select disabled />
            </Form.Item>
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label={defaultLabels.email}
              className="modal__form-group-item"
            >
              <Input disabled />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailSupplier;
