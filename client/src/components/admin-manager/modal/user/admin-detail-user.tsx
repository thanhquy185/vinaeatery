import { DatePicker, Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { UserType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import dayjs from "dayjs";

// Admin Detail User
const AdminDetailUser: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<UserType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id || undefined,
          createAt: dayjs(data?.createAt) || undefined,
          role: data?.role || undefined,
          username: data?.username || undefined,
          method: data?.method || undefined,
          isUsing: data?.isUsing || undefined,
          status: data?.status || undefined,
        }}
        className="modal__form split-2"
        disabled
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <DatePicker format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </div>
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="isUsing"
                label={defaultLabels.isUsing}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select className="text-center" />
              </Form.Item>
            </div>
            <Form.Item
              name="username"
              label={defaultLabels.username}
              className="modal__form-group-item margin-bottom-0"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="method"
              label={defaultLabels.method}
              className="modal__form-group-item"
            >
              <Select />
            </Form.Item>
            <Form.Item
              name="role"
              label={defaultLabels.role}
              className="modal__form-group-item"
            >
              <Select />
            </Form.Item>
            <Form.Item
              name="password"
              label={defaultLabels.password}
              className="modal__form-group-item margin-bottom-0"
            >
              <Input
                className="text-center"
                placeholder="Mật khẩu đã được mã hoá!"
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default AdminDetailUser;
