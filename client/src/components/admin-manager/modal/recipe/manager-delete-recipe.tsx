import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { RecipeType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";

// Manager Delete Recipe
const ManagerDeleteRecipe: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  recipes,
  setRecipes,
  closeModal,
}) => {
  const [form] = Form.useForm();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        className="modal__form split-2"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form.secondary button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn xoá ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Nguyên liệu cần xoá
            const ingredient = JSON.parse(form.getFieldValue("ingredient"));

            // Cập nhật danh sách nguyên liệu mới
            let newRecipes: RecipeType[] = [];
            for (let i = 0; i < recipes!.length; i++) {
              if (recipes![i].ingredientId !== ingredient.ingredientId) {
                newRecipes.push(recipes![i]);
              }
            }
            setRecipes!(newRecipes!);

            // Thành công thì thông báo
            closeModal();
            openNotification({
              type: "success",
              message: "Thành công",
              description: "Xoá thành công!",
            });
          }

          // Xoá class 'active' thể hiện nút không còn được nhấn
          submitButton?.classList.remove("active");
        }}
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <Form.Item
              name="ingredient"
              label={defaultLabels.ingredientDelete}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Nguyên liệu không được để trống!")]}
            >
              <Select
                showSearch
                allowClear
                placeholder={defaultInputs.ingredientDelete}
                options={recipes?.map((ingredient) => ({
                  label:
                    "#" +
                    ingredient.ingredientId +
                    " - " +
                    ingredient.ingredientName +
                    " - " +
                    ingredient.quantity +
                    " - " +
                    ingredient.note,
                  value: JSON.stringify(ingredient),
                }))}
              />
            </Form.Item>
            {/* <Form.Item
                name="quantity"
                label={defaultLabels.quantity}
                htmlFor="update-quantity"
                className="modal__form-group-item"
              >
                <InputNumber id="update-quantity" disabled />
              </Form.Item> */}
          </div>
          <div className="modal__form-group">
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
            </Form.Item>
            {/* <Form.Item
                name="note"
                label={defaultLabels.note}
                htmlFor="update-note"
                className="modal__form-group-item"
              >
                <TextArea
                  id="update-note"
                  className="multiple-2"
                  disabled
                />
              </Form.Item> */}
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn secondary-btn">
              Xác nhận
            </button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDeleteRecipe;
