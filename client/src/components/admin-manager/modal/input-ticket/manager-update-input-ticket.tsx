import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { InputTicketType } from "../../../../common/types";
import {
  InputTicketStatus,
  ModalLayout,
  PayStatus,
} from "../../../../common/values";
import CustomTableNoActions from "../../common/table-no-actions";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateInputTicket } from "../../../../requests/input-tickets";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/other-events";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";

// Manager Update InputTicket
const ManagerUpdateInputTicket: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  restaurantId,
  data,
  dataForCrud,
  tableNoActionsFormat,
  closeModal,
}) => {
  const [form] = Form.useForm();
  const updateMutation = useEntityMutation<InputTicketType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateInputTicket,
  });

  // Hàm gọi API để cập nhật trạng thái phiếu nhập
  const callApiToUpdateInputTicket = async (
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
      let payStatus = null,
        status = null;
      if (
        value === InputTicketStatus.giveback ||
        value === InputTicketStatus.confirm ||
        value === InputTicketStatus.canceled
      ) {
        status = value;
      } else if (value === PayStatus.pay || value === PayStatus.notPay) {
        payStatus = value;
      }

      // Thực thi mutation
      const response = await updateMutation.mutateAsync({
        values: {
          restaurantId: restaurantId,
          id: id,
          status: status! || undefined,
          payStatus: payStatus! || undefined,
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
        initialValues={{
          id: data?.id!,
          createAt: data?.createAt!,
          employee:
            "#" +
            data?.employee!.id +
            " - " +
            data?.employee!.fullname +
            " - " +
            data?.employee!.phone +
            " - " +
            data?.employee!.email,
          supplier:
            "#" +
            data?.supplier!.id +
            " - " +
            data?.supplier!.name +
            " - " +
            data?.supplier!.phone +
            " - " +
            data?.supplier!.email +
            " - " +
            data?.supplier!.address,
          totalPrice:
            vietnamMoneyFormat(data?.totalPrice!) +
            " (" +
            numberToVietnamWords(data?.totalPrice!) +
            ")",
          status: data?.status! + " (" + data?.payStatus! + ")",
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
              name="supplier"
              label={defaultLabels.supplier}
              className="modal__form-group-item multiple-3"
            >
              <Select />
            </Form.Item>
            <Form.Item
              label={defaultLabels.inputTicketDetails}
              className="modal__form-group-item multiple-3"
            >
              <CustomTableNoActions
                className="input-ticket-details"
                columnWidths={tableNoActionsFormat?.widths}
                columnTitles={tableNoActionsFormat?.columns}
                data={dataForCrud?.inputTicketDetails}
                attributes={tableNoActionsFormat?.attributes}
                format={tableNoActionsFormat?.format}
              />
            </Form.Item>
          </div>
        </div>
        <div className="modal__buttons">
          {data?.status === InputTicketStatus.confirm && (
            <button
              className="modal__button secondary btn purple-secondary"
              onClick={(e) =>
                callApiToUpdateInputTicket(
                  data?.id!,
                  e.target as HTMLElement,
                  InputTicketStatus.giveback,
                )
              }
            >
              {InputTicketStatus.giveback}
            </button>
          )}
          {data?.status === InputTicketStatus.pending && (
            <>
              <button
                className="modal__button secondary btn green-secondary"
                onClick={(e) =>
                  callApiToUpdateInputTicket(
                    data?.id!,
                    e.target as HTMLElement,
                    InputTicketStatus.confirm,
                  )
                }
              >
                {InputTicketStatus.confirm}
              </button>
              <button
                className="modal__button secondary btn red-secondary"
                onClick={(e) =>
                  callApiToUpdateInputTicket(
                    data?.id!,
                    e.target as HTMLElement,
                    InputTicketStatus.canceled,
                  )
                }
              >
                {InputTicketStatus.canceled}
              </button>
            </>
          )}
          {data?.status !== InputTicketStatus.pending && (
            <button
              className="modal__button secondary btn"
              onClick={(e) =>
                callApiToUpdateInputTicket(
                  data?.id!,
                  e.target as HTMLElement,
                  data?.payStatus! === PayStatus.pay
                    ? PayStatus.notPay
                    : PayStatus.pay,
                )
              }
            >
              {data?.payStatus === PayStatus.pay
                ? PayStatus.notPay
                : PayStatus.pay}
            </button>
          )}
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdateInputTicket;
