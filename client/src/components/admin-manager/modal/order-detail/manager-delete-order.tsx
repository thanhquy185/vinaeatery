import { Form, Input, InputNumber, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { OrderDetailType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";

// Manager Delete Order Detail
const ManagerDeleteOrderDetail: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  orderDetails,
  setOrderDetails,
  closeModal,
}) => {
  const [form] = Form.useForm();

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
            title: `Bạn có chắc chắn xoá ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Nguyên liệu cần xoá
            const food = JSON.parse(form.getFieldValue("food"));

            // Cập nhật danh sách nguyên liệu mới
            let newOrderDetails: OrderDetailType[] = [];
            for (let i = 0; i < orderDetails!.length; i++) {
              if (orderDetails![i].food.id !== food.food.id) {
                newOrderDetails.push(orderDetails![i]);
              }
            }
            setOrderDetails!(newOrderDetails);

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
              name="food"
              label={defaultLabels.foodDelete}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Món ăn không được để trống!")]}
            >
              <Select
                mode={undefined}
                showSearch
                allowClear
                placeholder={defaultInputs.foodDelete}
                options={orderDetails?.map((orderDetail) => ({
                  label:
                    "#" +
                    orderDetail!.food!.id +
                    " - " +
                    orderDetail!.food!.name +
                    " - " +
                    orderDetail!.price +
                    " - " +
                    orderDetail!.quantity,
                  value: JSON.stringify(orderDetail!),
                }))}
                onChange={(value) => {
                  if (!value) {
                    form.setFieldsValue({
                      price: undefined,
                      quantity: undefined,
                    });
                    return;
                  }
                  try {
                    const orderDetail = JSON.parse(value);
                    if (orderDetail) {
                      form.setFieldsValue({
                        price: orderDetail!.price,
                        quantity: orderDetail!.quantity,
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
            >
              <InputNumber disabled />
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

export default ManagerDeleteOrderDetail;
