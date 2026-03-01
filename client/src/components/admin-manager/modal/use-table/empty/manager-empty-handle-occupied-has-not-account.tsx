import { type FC } from "react";
import { Form, Input } from "antd";
import type { ManagerHandleUseTableProps } from "../../../../../common/props";
import {
  ruleEmail,
  rulePhone,
  ruleRequired,
} from "../../../../../common/rules";
import {
  ModalAutoComplete,
  ModalLayout,
  UseTableStatus,
} from "../../../../../common/values";

// Manager Empty Handle Occupied Has Not Account
const ManagerEmptyHandleOccupiedHasNotAccount: FC<
  ManagerHandleUseTableProps
> = ({ restaurantId, useTableId, callApiToUpdateUseTable, clickBack }) => {
  // - Form
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout={ModalLayout}
      autoComplete={ModalAutoComplete}
      className="modal__form split-3"
      onFinish={() => {
        // Nút để submit form
        const submitButton = document.querySelector(
          ".modal__form button[type='submit']"
        );

        callApiToUpdateUseTable!({
          id: useTableId,
          customerId: 1,
          customerFullname: form.getFieldValue("customerFullname"),
          customerPhone: form.getFieldValue("customerPhone"),
          customerEmail: form.getFieldValue("customerEmail"),
          button: submitButton as HTMLElement,
          value: UseTableStatus.occupied,
        });
      }}
    >
      <div className="modal__form-group-warper">
        <div className="modal__form-group">
          <Form.Item
            name="customerFullname"
            label="Họ và tên"
            htmlFor="customerFullname"
            className="modal__form-group-item"
            rules={[ruleRequired("Họ và tên không được để trống!")]}
          >
            <Input id="customerFullname" placeholder="Nhập họ và tên" />
          </Form.Item>
        </div>
        <div className="modal__form-group">
          <Form.Item
            name="customerPhone"
            label="Số điện thoại"
            htmlFor="customerPhone"
            className="modal__form-group-item"
            rules={[
              ruleRequired("Số điện thoại không được để trống!"),
              rulePhone(),
            ]}
          >
            <Input id="customerPhone" placeholder="Nhập Số điện thoại" />
          </Form.Item>
        </div>
        <div className="modal__form-group">
          <Form.Item
            name="customerEmail"
            label="Email"
            htmlFor="customerEmail"
            className="modal__form-group-item"
            rules={[ruleRequired("Email không được để trống!"), ruleEmail()]}
          >
            <Input id="customerEmail" placeholder="Nhập Email" />
          </Form.Item>
        </div>
      </div>
      <div className="modal__buttons">
        <button type="submit" className="modal__button secondary btn">
          Xác nhận
        </button>
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={clickBack}
        >
          Quay lại
        </button>
      </div>
    </Form>
  );
};

export default ManagerEmptyHandleOccupiedHasNotAccount;
