import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { IngredientType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import dayjs from "dayjs";

// Manager Detail Ingredient
const ManagerDetailIngredient: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<IngredientType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id! || undefined,
          name: data?.name! || undefined,
          categoryIngredient:
            "#" +
              data?.categoryIngredient!.id +
              " - " +
              data?.categoryIngredient!.name || undefined,
          unit: data?.unit! || undefined,
          capacity: data?.capacity! || undefined,
          dateCreate: dayjs(data?.dateCreate!) || undefined,
          dateRemove: dayjs(data?.dateRemove!) || undefined,
          inputPrice: data?.inputPrice! || undefined,
          inventory: data?.inventory! || undefined,
          note: data?.note! || undefined,
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
              name="categoryIngredient"
              label={defaultLabels.categoryIngredient}
              className="modal__form-group-item"
            >
              <Select disabled />
            </Form.Item>
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="dateCreate"
                label={defaultLabels.dateCreate}
                className="modal__form-group-item"
              >
                <DatePicker disabled />
              </Form.Item>
              <Form.Item
                name="dateRemove"
                label={defaultLabels.dateRemove}
                className="modal__form-group-item"
              >
                <DatePicker disabled />
              </Form.Item>
            </div>
            <Form.Item
              name="note"
              label={defaultLabels.note}
              className="modal__form-group-item multiple-2 margin-bottom-0"
            >
              <TextArea className="multiple-2" disabled />
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
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="unit"
                label={defaultLabels.unit}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="capacity"
                label={defaultLabels.capacity}
                className="modal__form-group-item"
              >
                <InputNumber disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="inputPrice"
                label={defaultLabels.inputPrice}
                className="modal__form-group-item"
              >
                <InputNumber disabled />
              </Form.Item>
              <Form.Item
                name="inventory"
                label={defaultLabels.inventory}
                className="modal__form-group-item"
              >
                <InputNumber disabled />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailIngredient;
