import useEntityQuery from "../../../../hooks/useEntityQuery2";
import FoodApiService from "../../../../services/api/v1/FoodApiService";
import TextArea from "antd/es/input/TextArea";
import ImageUploadComponent from "../../../ImageUploadComponent";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import TableInputComponent, {
  type TableInputComponentRowData,
} from "../../TableInputComponent";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { FoodDetailResponseType } from "../../../../types/FoodType";

const DetailFoodModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
}) => {
  const { data: foodDetail, isLoading } =
    useEntityQuery<FoodDetailResponseType>({
      keys: ["food", data.id],
      params: { id: data.id },
      api: FoodApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<FoodDetailResponseType>();

  return (
    <Spin spinning={!foodDetail || isLoading}>
      {dataForCrud && foodDetail && (
        <Form
          key={foodDetail.id}
          form={form}
          layout={ModalLayout}
          initialValues={{
            ...foodDetail,
            categoryFood:
              "#" +
              foodDetail.categoryFood.id +
              " - " +
              foodDetail.categoryFood.name,
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
                <ImageUploadComponent
                  defaultSrc={foodDetail.imageUrl}
                  alt="image-preview"
                  imageClassName="image-preview"
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
                  <InputNumber
                    formatter={(value) => inputNumberFormatter(value)}
                    parser={(value) => inputNumberParse(value)}
                  />
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
                label={defaultLabels.recipes}
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <TableInputComponent
                  type="detail"
                  base={dataForCrud.ingredients || []}
                  data={foodDetail.recipes.map(
                    (recipe) =>
                      ({
                        key: recipe.ingredient.id,
                        baseId: recipe.ingredient.id,
                        values: {
                          quantity: recipe.quantity,
                          note: recipe.note,
                        },
                      }) as unknown as TableInputComponentRowData,
                  )}
                  columnTitles={[
                    "Nguyên liệu (Giá bán)",
                    "Số lượng",
                    "Ghi chú",
                  ]}
                  attributes={["quantity", "note"]}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailFoodModalComponent;
