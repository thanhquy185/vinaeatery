import { useState } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import type { RcFile } from "antd/es/upload";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { FoodType, RecipeType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import CustomImageUpload from "../../../common/image-upload";
import CustomTableNoActions from "../../common/table-no-actions";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateFood } from "../../../../requests/foods";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Update Food
const ManagerUpdateFood: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  dataForCrud,
  tableNoActionsFormat,
  modalForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<RcFile>();
  const [recipe, setRecipe] = useState<RecipeType[]>(data?.recipe);
  const updateMutation = useEntityMutation<FoodType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateFood,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id! || undefined,
          name: data?.name! || undefined,
          categoryFoodId: data?.categoryFood!.id || undefined,
          unit: data?.unit! || undefined,
          price: data?.price! || undefined,
          description: data?.description! || undefined,
          status: data?.status! || undefined,
        }}
        className="modal__form split-3"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn cập nhật ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await updateMutation.mutateAsync({
              values: {
                restaurantId: restaurantId,
                image: imageFile! || undefined,
                recipe: recipe! || undefined,
                updateAt: new Date().toISOString(),
                ...values,
              },
            });
            if (response) {
              closeModal();
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }

          // Xoá class 'active' thể hiện nút không còn được nhấn
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
              <CustomImageUpload
                defaultSrc={data?.image as string}
                imageFile={imageFile}
                setImageFile={setImageFile}
                alt="image-preview"
                htmlFor="update-image"
                imageClassName="image-preview"
                imageCategoryName="foods"
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
                <InputNumber min={1} placeholder={defaultInputs.price} />
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
              label={defaultLabels.recipe}
              className="modal__form-group-item multiple-3"
            >
              <CustomTableNoActions
                className="recipe"
                columnWidths={tableNoActionsFormat?.widths}
                columnTitles={tableNoActionsFormat?.columns}
                data={recipe}
                attributes={tableNoActionsFormat?.attributes}
                format={tableNoActionsFormat?.format}
              />
              <div className="buttons">
                <button
                  type="button"
                  className="btn secondary-btn margin-r"
                  onClick={() =>
                    modalForCrud?.recipes?.openModalCreate?.({
                      recipes: recipe,
                      setRecipes: setRecipe,
                    })
                  }
                >
                  Thêm nguyên liệu
                </button>
                <button
                  type="button"
                  className="btn secondary-btn"
                  onClick={() =>
                    modalForCrud?.recipes?.openModalDelete?.({
                      recipes: recipe,
                      setRecipes: setRecipe,
                    })
                  }
                >
                  Xoá nguyên liệu
                </button>
              </div>
            </Form.Item>
          </div>
        </div>
        <div className="modal__buttons">
          <button type="submit" className="modal__button btn update">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdateFood;
