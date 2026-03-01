import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { InputTicketType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import CustomTableNoActions from "../../common/table-no-actions";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/other-events";

// Manager Detail Input Ticket
const ManagerDetailInputTicket: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
  dataForCrud,
  tableNoActionsFormat,
}) => {
  const [form] = Form.useForm<InputTicketType>();

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
              htmlFor="create-inputTicketDetails"
              className="modal__form-group-item multiple-3 margin-bottom-0"
            >
              <CustomTableNoActions
                id="create-inputTicketDetails"
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
      </Form>
    </>
  );
};

export default ManagerDetailInputTicket;
