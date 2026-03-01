import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { IngredientType, RecipeType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { FindAllIngredient } from "../../../../requests/ingredients";
import { useEntityQuery } from "../../../../hook/use-entity-query";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";

// Manager Create Recipe
const ManagerCreateRecipe: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  restaurantId,
  recipes,
  setRecipes,
  closeModal,
}) => {
  const [form] = Form.useForm();

  const { data: ingredients } = useEntityQuery<IngredientType[]>({
    keys: ["ingredients", restaurantId],
    params: {
      restaurantId: restaurantId,
    },
    api: FindAllIngredient,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        className="modal__form secondary split-2"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form.secondary button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn thêm ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Định dạng dữ liệu
            const newIngredient: RecipeType = {
              ingredientId: JSON.parse(values?.ingredient)!.id || undefined,
              ingredientName: JSON.parse(values?.ingredient)!.name || undefined,
              ingredientInventory:
                JSON.parse(values!.ingredient)!.inventory || undefined,
              quantity: values!.quantity || undefined,
              note: values!.note || undefined,
            };

            // Cập nhật danh sách nguyên liệu mới
            let newRecipe: RecipeType[] = [...recipes!];
            // - Kiểm tra nguyên liệu đã có tồn tại trong công thức hay chưa ?
            let isExists = false;
            for (let i = 0; i < newRecipe.length; i++) {
              if (newRecipe[i].ingredientId === newIngredient.ingredientId) {
                newRecipe[i].quantity = newIngredient.quantity;
                newRecipe[i].note = newIngredient.note;
                isExists = true;
              }
            }
            if (!isExists) {
              newRecipe.push(newIngredient);
            }
            // - Sắp xếp theo mã nguyên liệu tăng dần
            newRecipe.sort(
              (a, b) =>
                (a!.ingredientId as number) - (b!.ingredientId as number),
            );
            // - Cập nhật
            setRecipes!(newRecipe!);

            // Thành công thì thông báo
            closeModal();
            openNotification({
              type: "success",
              message: "Thành công",
              description: "Thêm thành công!",
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
              label={defaultLabels.ingredientCreate}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Nguyên liệu không được để trống!")]}
            >
              <Select
                mode={undefined}
                showSearch
                allowClear
                placeholder={defaultInputs.ingredientCreate}
                options={ingredients?.map((ingredient) => ({
                  label:
                    "#" +
                    ingredient!.id +
                    " - " +
                    ingredient!.name +
                    " - " +
                    ingredient!.categoryIngredient!.name +
                    " (#" +
                    ingredient!.categoryIngredient!.id +
                    ")" +
                    " - " +
                    ingredient!.capacity +
                    " " +
                    ingredient!.unit,
                  value: JSON.stringify(ingredient!),
                }))}
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              label={defaultLabels.quantity}
              className="modal__form-group-item"
              rules={[ruleRequired("Số lượng không được để trống!")]}
            >
              <InputNumber min={1} placeholder={defaultInputs.quantity} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
            </Form.Item>
            <Form.Item
              name="note"
              label={defaultLabels.note}
              className="modal__form-group-item"
            >
              <TextArea
                className="multiple-2"
                placeholder={defaultInputs.note}
              />
            </Form.Item>
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

export default ManagerCreateRecipe;
