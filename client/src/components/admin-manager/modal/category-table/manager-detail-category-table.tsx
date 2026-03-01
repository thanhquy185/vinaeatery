import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { CategoryFoodType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";

// Manager Detail Category Table
const ManagerDetailCategoryTable: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<CategoryFoodType>();

  return (
    <>
      <Form
        layout={ModalLayout}
        form={form}
        initialValues={{
          id: data?.id! || undefined,
          name: data?.name! || undefined,
          surchargeType: data?.surchargeType! || undefined,
          surchargeValue: data?.surchargeValue! || undefined,
          description: data?.description! || undefined,
          status: data?.status! || undefined,
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
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="surchargeType"
                label={defaultLabels.surchargeType}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                name="surchargeValue"
                label={defaultLabels.surchargeValue}
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

export default ManagerDetailCategoryTable;
