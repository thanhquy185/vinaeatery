import { Form, Input, InputNumber, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { InputTicketDetailType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";

// Manager Delete Input Ticket Detail
const ManagerDeleteInputTicketDetail: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  inputTicketDetails,
  setInputTicketDetails,
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
            let newInputTicketDetails: InputTicketDetailType[] = [];
            for (let i = 0; i < inputTicketDetails!.length; i++) {
              if (
                inputTicketDetails![i]?.ingredient?.id !==
                ingredient.ingredient.id
              ) {
                newInputTicketDetails.push(inputTicketDetails![i]);
              }
            }
            setInputTicketDetails!(newInputTicketDetails);

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
                mode={undefined}
                showSearch
                allowClear
                placeholder={defaultInputs.ingredientDelete}
                options={inputTicketDetails?.map((inputTicketDetail) => ({
                  label:
                    "#" +
                    inputTicketDetail!.ingredient!.id +
                    " - " +
                    inputTicketDetail!.ingredient!.name +
                    " - " +
                    inputTicketDetail!.price +
                    " - " +
                    inputTicketDetail!.quantity,
                  value: JSON.stringify(inputTicketDetail!),
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
                    const inputTicketDetail = JSON.parse(value);
                    if (inputTicketDetail) {
                      form.setFieldsValue({
                        price: inputTicketDetail!.price,
                        quantity: inputTicketDetail!.quantity,
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
        </div>
        <div className="modal__buttons">
          <button type="submit" className="modal__button btn secondary-btn">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerDeleteInputTicketDetail;
