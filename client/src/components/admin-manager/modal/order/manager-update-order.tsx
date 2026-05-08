import type { FC } from "react";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { OrderType } from "../../../../common/types";
import {
  ModalAutoComplete,
  ModalLayout,
  OrderStatus,
} from "../../../../common/values";
import CustomTableNoActions from "../../common/table-no-actions";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateOrder } from "../../../../requests/orders";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/other-events";
import { openNotification } from "../../../../utils/show-notification";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Update Order
const ManagerUpdateOrder: FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  dataForCrud,
  tableNoActionsFormat,
  closeModal,
}) => {
  const [form] = Form.useForm<OrderType>();
  const updateMutation = useEntityMutation<OrderType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateOrder,
  });
  const callApiToUpdateOrder = async (
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
          createAt: data?.createAt!,
          employeeId: data?.employee?.id,
          employee:
            "#" +
            data?.employee!.id +
            " - " +
            data?.employee!.fullname +
            " - " +
            data?.employee!.phone +
            " - " +
            data?.employee!.email,
          customer:
            "#" +
            data?.customer!.id +
            " - " +
            data?.customer!.fullname +
            " - " +
            data?.customer!.phone +
            " - " +
            data?.customer!.email +
            " - " +
            data?.customer!.address,
          totalPrice:
            vietnamMoneyFormat(data?.totalPrice!) +
            " (" +
            numberToVietnamWords(data?.totalPrice!) +
            ")",
          status: data?.status! + " (" + data?.payStatus! + ")",
          payId: data?.payId,
          payMethod: "#" + data?.payMethod?.id + " - " + data?.payMethod?.name,
          payTime: dayjs(data?.payTime),
          payTotalPrice:
            vietnamMoneyFormat(data?.payTotalPrice!) +
            " (" +
            numberToVietnamWords(data?.payTotalPrice!) +
            ")",
          payStatus: data?.payStatus,
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
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
            </div>
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="employee"
              label={defaultLabels.employee}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="totalPrice"
              label={defaultLabels.totalPrice}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
          </div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title2}</p>
          <div className="modal__form-group">
            <Form.Item
              name="customer"
              label={defaultLabels.customer}
              className="modal__form-group-item multiple-3"
            >
              <Select />
            </Form.Item>
            <Form.Item
              label={defaultLabels.orderDetails}
              className="modal__form-group-item multiple-3 margin-bottom-0"
            >
              <CustomTableNoActions
                columnWidths={tableNoActionsFormat?.widths}
                columnTitles={tableNoActionsFormat?.columns}
                data={data?.orderDetails}
                attributes={tableNoActionsFormat?.attributes}
                format={tableNoActionsFormat?.format}
              />
            </Form.Item>
          </div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title3}</p>
          <div className="modal__form-group">
            <Form.Item
              name="payId"
              label={defaultLabels.payId}
              className="modal__form-group-item"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="payStatus"
              label={defaultLabels.payStatus}
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
              name="payMethod"
              label={defaultLabels.payMethod}
              className="modal__form-group-item"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="payTotalPrice"
              label={defaultLabels.payTotalPrice}
              className={
                "modal__form-group-item multiple-2 " +
                (data?.status !== OrderStatus.pending ? "margin-bottom-0" : "")
              }
            >
              <InputNumber />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="payTime"
              label={defaultLabels.payTime}
              className="modal__form-group-item"
            >
              <DatePicker showTime format="YYYY-MM-DD HH:MM:ss" />
            </Form.Item>
          </div>
        </div>
        {data?.status === OrderStatus.pending && (
          <div className="modal__buttons">
            <button
              className="modal__button secondary btn green-secondary"
              onClick={(e) =>
                callApiToUpdateOrder(
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
                callApiToUpdateOrder(
                  data?.id!,
                  e.target as HTMLElement,
                  OrderStatus.canceled,
                )
              }
            >
              {OrderStatus.canceled}
            </button>
          </div>
        )}
      </Form>
    </>
  );
};

export default ManagerUpdateOrder;
