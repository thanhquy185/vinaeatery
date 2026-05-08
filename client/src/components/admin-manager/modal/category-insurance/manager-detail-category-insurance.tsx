import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { CategoryInsuranceType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";

// Manager Detail Category Insurance
const ManagerDetailCategoryInsurance: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<CategoryInsuranceType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id || undefined,
          name: data?.name || undefined,
          companyPercent: data?.companyPercent || undefined,
          employeePercent: data?.employeePercent || undefined,
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
              className="modal__form-group-item"
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
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="companyPercent"
                label={defaultLabels.companyPercent}
                className="modal__form-group-item"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="employeePercent"
                label={defaultLabels.employeePercent}
                className="modal__form-group-item"
              >
                <InputNumber />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailCategoryInsurance;
