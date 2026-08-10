import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import ImageUploadComponent from "../../../ImageUploadComponent";
import FoodApiService from "../../../../services/api/v1/FoodApiService";
import { useState } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  FoodStatusValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import TableInputComponent, {
  type TableInputComponentRowData,
} from "../../TableInputComponent";
import { openConfirmation } from "../../../../utils/showConfirmation";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { RcFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  FoodCreateRequestType,
  FoodDetailResponseType,
} from "../../../../types/FoodType";

const CreateFoodModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<FoodCreateRequestType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const [recipes, setRecipes] = useState<TableInputComponentRowData[]>([]);

  const createMutation = useEntityMutation<
    FoodCreateRequestType,
    FoodDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: FoodApiService.handleCreate,
  });

  return (
    <>
      {restaurantId && dataForCrud && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          className="modal__form split-3"
          onFinish={async () => {
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            submitButton?.classList.add("active");

            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              const values = form.getFieldsValue();

              const response = await createMutation.mutateAsync({
                values: {
                  ...values,
                  restaurantId: restaurantId,
                  image: imageFile ?? undefined,
                  recipes: recipes.map((recipe: any) => ({
                    ingredientId: recipe.baseId,
                    quantity: recipe.values.quantity,
                    note: recipe.values.note,
                  })),
                },
              });
              if (response) {
                closeModal();
              }
            }

            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels.image}
                htmlFor="create-image"
                className="modal__form-group-item"
              >
                <ImageUploadComponent
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="create-image"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs.image}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input
                  className="text-center"
                  placeholder={defaultInputs.id}
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Tên món ăn không được để trống!")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                name="categoryFoodId"
                label={defaultLabels.categoryFood}
                className="modal__form-group-item"
                rules={[ruleRequired("Loại món ăn không được để trống!")]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={defaultInputs.categoryFood}
                  options={dataForCrud?.categoryFoods!.map((categoryFood) => ({
                    label: `#${categoryFood.id} - ${categoryFood.name}`,
                    value: categoryFood.id,
                  }))}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="unit"
                  label={defaultLabels.unit}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Đơn vị!")]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder={defaultInputs.unit}
                    options={dataForCrud?.units!.map((unit) => ({
                      label: unit,
                      value: unit,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="price"
                  label={defaultLabels.price}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Giá bán!")]}
                >
                  <InputNumber
                    min={0}
                    formatter={(value) => inputNumberFormatter(value)}
                    parser={(value) => inputNumberParse(value)}
                    placeholder={defaultInputs.price}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
                rules={[ruleRequired("Trạng thái không được để trống!")]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={defaultInputs.status}
                  options={[
                    {
                      label: FoodStatusValue.active,
                      value: FoodStatusValue.active,
                    },
                    {
                      label: FoodStatusValue.inactive,
                      value: FoodStatusValue.inactive,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item"
              >
                <TextArea
                  placeholder={defaultInputs.description}
                  className="multiple-2"
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title2}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels.recipes}
                className="modal__form-group-item multiple-3"
              >
                <TableInputComponent
                  object="food"
                  base={dataForCrud.ingredients || []}
                  data={recipes}
                  onChange={setRecipes}
                  columnTitles={["Nguyên liệu", "Số lượng", "Ghi chú"]}
                  attributes={["quantity", "note"]}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </>
  );
};

export default CreateFoodModalComponent;
