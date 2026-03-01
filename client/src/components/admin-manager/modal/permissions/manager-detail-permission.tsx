import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { PermissionType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import CustomTablePermissionDetails from "../../common/table-permission-details";

// Manager Detail Permission
const ManagerDetailPermission: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<PermissionType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id || undefined,
          name: data?.name || undefined,
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
              label={defaultLabels.permissionDetails}
              htmlFor="detail-permissionDetails"
              className="modal__form-group-item multiple-2 margin-bottom-0"
            >
              <CustomTablePermissionDetails
                type="detail"
                data={data?.permissionDetails}
              />
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

export default ManagerDetailPermission;
