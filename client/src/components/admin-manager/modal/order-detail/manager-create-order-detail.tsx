import { Form, Input, InputNumber, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { FoodType, OrderDetailType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { FindAllFood } from "../../../../requests/foods";
import { useEntityQuery } from "../../../../hook/use-entity-query";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";

// Manager Create Input Ticket Detail
const ManagerCreateOrderDetail: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  restaurantId,
  orderDetails,
  setOrderDetails,
  closeModal,
}) => {
  const [form] = Form.useForm();

  const { data: foods } = useEntityQuery<FoodType[]>({
    keys: ["foods", restaurantId],
    params: {
      restaurantId: restaurantId,
    },
    api: FindAllFood,
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
            const newOrderDetail: OrderDetailType = {
              food: JSON.parse(values!.food) || undefined,
              price: values!.price || undefined,
              quantity: values!.quantity || undefined,
            };

            // Cập nhật danh sách nguyên liệu mới
            let newOrderDetails: OrderDetailType[] = [...orderDetails!];
            // - Kiểm tra nguyên liệu đã có tồn tại trong công thức hay chưa ?
            let isExists = false;
            for (let i = 0; i < orderDetails!.length; i++) {
              if (orderDetails![i].food.id === newOrderDetail.food.id) {
                orderDetails![i].price = newOrderDetail.price;
                orderDetails![i].quantity = newOrderDetail.quantity;
                isExists = true;
              }
            }
            if (!isExists) {
              newOrderDetails.push(newOrderDetail);
            }
            // - Sắp xếp theo mã nguyên liệu tăng dần
            newOrderDetails.sort(
              (a, b) => (a!.food.id as number) - (b!.food.id as number),
            );
            // - Cập nhật
            setOrderDetails!(newOrderDetails!);

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
              name="food"
              label={defaultLabels.foodCreate}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Món ăn không được để trống!")]}
            >
              <Select
                mode={undefined}
                showSearch
                allowClear
                placeholder={defaultInputs.foodCreate}
                options={foods?.map((food) => ({
                  label:
                    "#" +
                    food!.id +
                    " - " +
                    food!.name +
                    " - " +
                    food!.categoryFood!.name +
                    " (#" +
                    food!.categoryFood!.id +
                    ")" +
                    " - " +
                    food!.unit +
                    " - " +
                    food!.price,
                  value: JSON.stringify(food!),
                }))}
                onChange={(value) => {
                  if (!value) {
                    form.setFieldsValue({ price: undefined });
                    return;
                  }
                  try {
                    const selectedFood = JSON.parse(value);
                    if (selectedFood && selectedFood.price) {
                      form.setFieldsValue({
                        price: selectedFood.price,
                      });
                    }
                  } catch (err) {
                    console.error("Parse Food failed:", err);
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              name="price"
              label={defaultLabels.price}
              className="modal__form-group-item"
            >
              <InputNumber disabled />
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

export default ManagerCreateOrderDetail;
