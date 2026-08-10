import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import ImageUploadComponent from "../../../ImageUploadComponent";
import FoodApiService from "../../../../services/api/v1/FoodApiService";
import { useMemo, useState } from "react";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import { ModalAutoComplete, ModalLayout } from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { RcFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  FoodDetailResponseType,
  FoodUpdateRequestType,
} from "../../../../types/FoodType";
import TableInputComponent, {
  type TableInputComponentRowData,
} from "../../TableInputComponent";

const UpdateRecipeModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: foodDetail, isLoading } =
    useEntityQuery<FoodDetailResponseType>({
      keys: ["food", data.id],
      params: { id: data.id },
      api: FoodApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<FoodUpdateRequestType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const [recipes, setRecipes] = useState<TableInputComponentRowData[]>([]);

  const updateMutation = useEntityMutation<
    FoodUpdateRequestType,
    FoodDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["food", data.id]],
    api: FoodApiService.handleUpdate,
  });

  useMemo(() => {
    if (foodDetail) {
      setRecipes(
        foodDetail.recipes.map(
          (recipe) =>
            ({
              key: recipe.ingredient.id,
              baseId: recipe.ingredient.id,
              values: {
                quantity: recipe.quantity,
                note: recipe.note,
              },
            }) as unknown as TableInputComponentRowData,
        ),
      );
    }
  }, [foodDetail]);

  return (
    <Spin spinning={!foodDetail || isLoading}>
      {dataForCrud && foodDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={{
            ...foodDetail,
            categoryFoodId: foodDetail.categoryFood.id,
          }}
          className="modal__form split-3"
          onFinish={async () => {
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            submitButton?.classList.add("active");

            const answer = await openConfirmation({
              title: `Bạn có chắc chắn cập nhật ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              const values = form.getFieldsValue();

              const response = await updateMutation.mutateAsync({
                values: {
                  ...values,
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
                htmlFor="update-image"
                className="modal__form-group-item"
              >
                <ImageUploadComponent
                  defaultSrc={data.image as string}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="update-image"
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
                <Input className="text-center" disabled />
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
                  options={dataForCrud?.categoryFoods?.map((categoryFood) => ({
                    label: "#" + categoryFood.id + " - " + categoryFood.name,
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
                    options={dataForCrud?.units?.map((unit) => ({
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
              >
                <Select disabled />
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
                  base={dataForCrud.ingredients || []}
                  data={recipes}
                  onChange={setRecipes}
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
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default UpdateRecipeModalComponent;
