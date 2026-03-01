import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { FoodType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import CustomImageUpload from "../../../common/image-upload";
import CustomTableNoActions from "../../common/table-no-actions";

// Manager Detail Food
const ManagerDetailFood: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  tableNoActionsFormat,
}) => {
  const [form] = Form.useForm<FoodType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id! || undefined,
          name: data?.name! || undefined,
          categoryFood:
            "#" + data?.categoryFood!.id + " - " + data?.categoryFood!.name ||
            undefined,
          unit: data?.unit! || undefined,
          price: data?.price! || undefined,
          description: data?.description! || undefined,
          status: data?.status! || undefined,
        }}
        className="modal__form split-3"
        disabled
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title1}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.image}
              className="modal__form-group-item margin-bottom-0"
            >
              <CustomImageUpload
                defaultSrc={data?.image as string}
                alt="image-preview"
                imageClassName="image-preview"
                imageCategoryName="foods"
                uploadClassName="image-uploader"
                labelButton={defaultInputs.image}
                disabled
              />
            </Form.Item>
          </div>
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
              name="categoryFood"
              label={defaultLabels.categoryFood}
              className="modal__form-group-item"
            >
              <Select />
            </Form.Item>
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="unit"
                label={defaultLabels.unit}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                name="price"
                label={defaultLabels.price}
                className="modal__form-group-item"
              >
                <InputNumber />
              </Form.Item>
            </div>
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
              name="description"
              label={defaultLabels.description}
              className="modal__form-group-item"
            >
              <TextArea className="multiple-2" />
            </Form.Item>
          </div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title2}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.recipe}
              className="modal__form-group-item multiple-3 margin-bottom-0"
            >
              <CustomTableNoActions
                className="recipe"
                columnWidths={tableNoActionsFormat?.widths}
                columnTitles={tableNoActionsFormat?.columns}
                data={dataForCrud?.recipes}
                attributes={tableNoActionsFormat?.attributes}
                format={tableNoActionsFormat?.format}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailFood;
