import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../common/rules";
import type { OrderTableType } from "../../../../common/types";
import {
  ModalAutoComplete,
  ModalLayout,
  OrderStatus,
} from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateOrderTable } from "../../../../requests/order-tables";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Create Order Table
const ManagerCreateOrderTable: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<OrderTableType>();
  const createMutation = useEntityMutation<OrderTableType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateOrderTable,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          createAt: dayjs(),
          //   arriveAt: undefined,
          employee:
            "#" +
            dataForCrud?.infoLogin!.id +
            " - " +
            dataForCrud?.infoLogin!.fullname +
            " - " +
            dataForCrud?.infoLogin!.phone +
            " - " +
            dataForCrud?.infoLogin!.email,
          //   customerFullname: undefined,
          //   customerPhone: undefined,
          //   customerEmail: undefined,
          //   customerNote: undefined,
          //   guests: undefined,
          status: OrderStatus.pending,
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
            title: `Bạn có chắc chắn thêm ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await createMutation.mutateAsync({
              values: {
                ...values,
                restaurantId: restaurantId,
                employeeId: dataForCrud?.infoLogin?.id,
                customerId: 1, // Mặc định vì đây là khách hàng ảo (Chưa có tài khoản trên hệ thống)
                createAt:
                  values?.createAt && dayjs(values?.createAt).isValid()
                    ? dayjs(values?.createAt).format("YYYY-MM-DD HH:mm:ss")
                    : undefined,
                arriveAt:
                  values?.arriveAt && dayjs(values?.arriveAt).isValid()
                    ? dayjs(values?.arriveAt).format("YYYY-MM-DD HH:mm:ss")
                    : undefined,
                status: OrderStatus.pending,
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
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input
                  placeholder={defaultInputs.id}
                  className="text-center"
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Input disabled />
              </Form.Item>
            </div>
            <Form.Item
              name="createAt"
              label={defaultLabels.createAt}
              className="modal__form-group-item"
              rules={[ruleRequired("Thời gian đặt bàn không được để trống!")]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={defaultInputs.createAt}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="employee"
              label={defaultLabels.employee}
              className="modal__form-group-item multiple-2"
            >
              <Select disabled />
            </Form.Item>
            <Form.Item
              name="arriveAt"
              label={defaultLabels.arriveAt}
              className="modal__form-group-item"
              rules={[ruleRequired("Thời gian dự kiến không được để trống!")]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={defaultInputs.arriveAt}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="guests"
              label={defaultLabels.guests}
              className="modal__form-group-item"
              rules={[ruleRequired("Số lượng khách không được để trống!")]}
            >
              <InputNumber min={1} placeholder={defaultInputs.guests} />
            </Form.Item>
          </div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title2}</p>
          <div className="modal__form-group">
            <Form.Item
              name="customerFullname"
              label={defaultLabels.customerFullname}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Họ và tên không được để trống!")]}
            >
              <Input placeholder={defaultInputs.customerFullname} />
            </Form.Item>
            <Form.Item
              name="customerPhone"
              label={defaultLabels.customerPhone}
              className="modal__form-group-item"
              rules={[
                ruleRequired("Số điện thoại không được để trống!"),
                rulePhone(),
              ]}
            >
              <Input placeholder={defaultInputs.customerPhone} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="customerEmail"
              label={defaultLabels.customerEmail}
              className="modal__form-group-item"
              rules={[ruleRequired("Email không được để trống!"), ruleEmail()]}
            >
              <Input placeholder={defaultInputs.customerEmail} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="customerNote"
              label={defaultLabels.customerNote}
              className="modal__form-group-item"
            >
              <TextArea
                className="multiple-2"
                placeholder={defaultInputs.customerNote}
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
    </>
  );
};

export default ManagerCreateOrderTable;
