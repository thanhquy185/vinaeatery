import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { OrderTableType } from "../../../../common/types";
import {
  ModalAutoComplete,
  ModalLayout,
  OrderStatus,
} from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateOrderTable } from "../../../../requests/order-tables";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";
import { openNotification } from "../../../../utils/show-notification";

// Manager Update Order Table
const ManagerUpdateOrderTable: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<OrderTableType>();
  const updateMutation = useEntityMutation<OrderTableType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateOrderTable,
  });

  // Hàm gọi API để cập nhật trạng thái đơn món ăn
  const callApiToUpdateOrderTable = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    // Thêm class 'active' thể hiện là nút được nhấn
    button.classList.add("active");

    // Hỏi trước khi xử khi xử lý ?
    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Kiểm tra người dùng hiện tại
      if (
        Number(form.getFieldValue("employeeId")) !== dataForCrud?.infoLogin?.id
      ) {
        openNotification({
          type: "warning",
          message: "Cảnh báo",
          description:
            "Bạn không phải người tạo đơn này nên không thể cập nhật trạng thái!",
        });

        return;
      }

      // Biến giữ giá trị tương ứng với "trạng thái" cần thay đổi
      let status = null;
      if (value === OrderStatus.confirm || value === OrderStatus.canceled) {
        status = value;
      }

      // Thực thi mutation
      const response = await updateMutation.mutateAsync({
        values: {
          restaurantId: restaurantId,
          id: id,
          status: status! || undefined,
        },
      });
      if (response) {
        closeModal();
      }
    } else {
      // Xoá class 'active' thể hiện là nút không còn được nhấn
      button.classList.remove("active");
    }
  };

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id!,
          createAt: dayjs(data?.createAt!),
          arriveAt: dayjs(data?.arriveAt!),
          employeeId: data?.employee?.id,
          employee: data?.employee
            ? "#" +
              data?.employee!.id +
              " - " +
              data?.employee!.fullname +
              " - " +
              data?.employee!.phone +
              " - " +
              data?.employee!.email
            : "Chưa có nhân viên xác nhận",
          customerFullname: data?.customerFullname!,
          customerPhone: data?.customerPhone!,
          customerEmail: data?.customerEmail!,
          customerNote: data?.customerNote!,
          guests: data?.guests!,
          status: data?.status!,
        }}
        className="modal__form split-3"
        disabled
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title1}</p>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
            </div>
            <Form.Item
              name="createAt"
              label={defaultLabels.createAt}
              className="modal__form-group-item"
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="employee"
              label={defaultLabels.employee}
              className="modal__form-group-item multiple-2"
            >
              <Select />
            </Form.Item>
            <Form.Item
              name="arriveAt"
              label={defaultLabels.arriveAt}
              className="modal__form-group-item"
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
            </Form.Item>
            <Form.Item
              name="guests"
              label={defaultLabels.guests}
              className="modal__form-group-item"
            >
              <InputNumber />
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
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="customerPhone"
              label={defaultLabels.customerPhone}
              className={
                "modal__form-group-item " +
                (data?.status !== OrderStatus.pending ? "margin-bottom-0" : "")
              }
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
            </Form.Item>
            <Form.Item
              name="customerEmail"
              label={defaultLabels.customerEmail}
              className={
                "modal__form-group-item " +
                (data?.status !== OrderStatus.pending ? "margin-bottom-0" : "")
              }
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="customerNote"
              label={defaultLabels.customerNote}
              className={
                "modal__form-group-item " +
                (data?.status !== OrderStatus.pending ? "margin-bottom-0" : "")
              }
            >
              <TextArea className="multiple-2" />
            </Form.Item>
          </div>
        </div>
        {data?.status === OrderStatus.pending && (
          <div className="modal__buttons">
            <>
              <button
                className="modal__button secondary btn green-secondary"
                onClick={(e) =>
                  callApiToUpdateOrderTable(
                    data?.id!,
                    e.target as HTMLElement,
                    OrderStatus.confirm,
                  )
                }
              >
                {OrderStatus.confirm}
              </button>
              <button
                className="modal__button secondary btn red-secondary"
                onClick={(e) =>
                  callApiToUpdateOrderTable(
                    data?.id!,
                    e.target as HTMLElement,
                    OrderStatus.canceled,
                  )
                }
              >
                {OrderStatus.canceled}
              </button>
            </>
          </div>
        )}
      </Form>
    </>
  );
};

export default ManagerUpdateOrderTable;
