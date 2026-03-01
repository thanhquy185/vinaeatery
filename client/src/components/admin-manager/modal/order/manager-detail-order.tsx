import type { FC } from "react";
import { DatePicker, Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { OrderType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import CustomTableNoActions from "../../common/table-no-actions";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/other-events";
import dayjs from "dayjs";

// Manager Detail Order
const ManagerDetailOrder: FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
  dataForCrud,
  tableNoActionsFormat,
}) => {
  const [form] = Form.useForm<OrderType>();

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
          customerFullname: data?.customerFullname,
          customerPhone: data?.customerPhone,
          customerEmail: data?.customerEmail,
          totalPrice:
            vietnamMoneyFormat(data?.totalPrice!) +
            " (" +
            numberToVietnamWords(data?.totalPrice!) +
            ")",
          status: data?.status,
          payId: data?.payId,
          payMethod: "#" + data?.payMethod?.id + " - " + data?.payMethod?.name,
          payTime: dayjs(data?.payTime!, "YYYY-MM-DD HH:mm:ss"),
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
              name="customerFullname"
              label={defaultLabels.customerFullname}
              className="modal__form-group-item"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={defaultLabels.orderDetails}
              className="modal__form-group-item multiple-3 margin-bottom-0"
            >
              <CustomTableNoActions
                className="orders-details"
                columnWidths={tableNoActionsFormat?.widths}
                columnTitles={tableNoActionsFormat?.columns}
                data={dataForCrud?.orderDetails}
                attributes={tableNoActionsFormat?.attributes}
                format={tableNoActionsFormat?.format}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="customerPhone"
              label={defaultLabels.customerPhone}
              className="modal__form-group-item"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="customerEmail"
              label={defaultLabels.customerEmail}
              className="modal__form-group-item"
            >
              <Input />
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
              className="modal__form-group-item margin-bottom-0"
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
              className="modal__form-group-item multiple-2 margin-bottom-0"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="payTime"
              label={defaultLabels.payTime}
              className="modal__form-group-item"
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailOrder;
