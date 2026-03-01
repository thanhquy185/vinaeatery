import { Form, Input, InputNumber, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type {
  IngredientType,
  InputTicketDetailType,
} from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { FindAllIngredient } from "../../../../requests/ingredients";
import { useEntityQuery } from "../../../../hook/use-entity-query";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";

// Manager Create Input Ticket Detail
const ManagerCreateInputTicketDetail: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  restaurantId,
  inputTicketDetails,
  setInputTicketDetails,
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
            const newInputTicketDetail: InputTicketDetailType = {
              ingredient: JSON.parse(values!.ingredient) || undefined,
              price: values!.price || undefined,
              quantity: values!.quantity || undefined,
            };

            // Cập nhật danh sách nguyên liệu mới
            let newInputTicketDetails: InputTicketDetailType[] = [
              ...inputTicketDetails!,
            ];
            // - Kiểm tra nguyên liệu đã có tồn tại trong công thức hay chưa ?
            let isExists = false;
            for (let i = 0; i < inputTicketDetails!.length; i++) {
              if (
                inputTicketDetails![i]?.ingredient?.id ===
                newInputTicketDetail?.ingredient?.id
              ) {
                inputTicketDetails![i].price = newInputTicketDetail.price;
                inputTicketDetails![i].quantity = newInputTicketDetail.quantity;
                isExists = true;
              }
            }
            if (!isExists) {
              newInputTicketDetails.push(newInputTicketDetail);
            }
            // - Sắp xếp theo mã nguyên liệu tăng dần
            newInputTicketDetails.sort(
              (a, b) =>
                (a!.ingredient?.id as number) - (b!.ingredient?.id as number),
            );
            // - Cập nhật
            setInputTicketDetails!(newInputTicketDetails!);

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
                    ingredient!.unit +
                    " - " +
                    ingredient!.inputPrice,
                  value: JSON.stringify(ingredient!),
                }))}
                onChange={(value) => {
                  if (!value) {
                    form.setFieldsValue({ price: undefined });
                    return;
                  }
                  try {
                    const selectedIngredient = JSON.parse(value);
                    if (selectedIngredient && selectedIngredient.inputPrice) {
                      form.setFieldsValue({
                        price: selectedIngredient.inputPrice,
                      });
                    }
                  } catch (err) {
                    console.error("Parse ingredient failed:", err);
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              name="price"
              label={defaultLabels.price}
              className="modal__form-group-item"
              rules={[ruleRequired("Giá nhập không được để trống!")]}
            >
              <InputNumber min={1} placeholder={defaultInputs.price} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
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

export default ManagerCreateInputTicketDetail;
