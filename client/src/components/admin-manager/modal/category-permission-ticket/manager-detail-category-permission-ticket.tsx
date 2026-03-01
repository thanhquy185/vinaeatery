import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { CategoryPermissionTicketType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";

// Manager Detail Category Permission Ticket
const ManagerDetailCategoryPermissionTicket: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<CategoryPermissionTicketType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id || undefined,
          name: data?.name || undefined,
          description: data?.description || undefined,
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
              name="description"
              label={defaultLabels.description}
              className="modal__form-group-item multiple-2 margin-bottom-0"
            >
              <TextArea className="multiple-2" />
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
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailCategoryPermissionTicket;
