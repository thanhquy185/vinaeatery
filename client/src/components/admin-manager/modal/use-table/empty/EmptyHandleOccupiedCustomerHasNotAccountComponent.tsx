import { Form, Input, InputNumber } from "antd";
import {
  ruleEmail,
  rulePhone,
  ruleRequired,
} from "../../../../../constants/rules";
import {
  ModalAutoComplete,
  ModalLayout,
} from "../../../../../constants/values";
import type { ManagerHandleUpdateStatusUseTableProps } from "../../../../../constants/props";

const EmptyHandleOccupiedCustomerHasNotAccountComponent: React.FC<
  ManagerHandleUpdateStatusUseTableProps
> = ({ form }) => {
  return (
    <Form
      form={form}
      layout={ModalLayout}
      autoComplete={ModalAutoComplete}
      className="modal__form split-3"
    >
      <div className="modal__form-group-warper">
        <div className="modal__form-group">
          <Form.Item
            name="customerFullname"
            label="Họ và tên"
            className="modal__form-group-item"
            rules={[ruleRequired("Họ và tên không được để trống!")]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="customerAdult"
            label="Số lượng người lớn"
            className="modal__form-group-item"
            rules={[ruleRequired("Số lượng người lớn không được để trống!")]}
          >
            <InputNumber min={0} placeholder="Nhập Số lượng người lớn" />
          </Form.Item>
        </div>
        <div className="modal__form-group">
          <Form.Item
            name="customerPhone"
            label="Số điện thoại"
            className="modal__form-group-item"
            rules={[
              ruleRequired("Số điện thoại không được để trống!"),
              rulePhone(),
            ]}
          >
            <Input placeholder="Nhập Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="customerChild"
            label="Số lượng trẻ em"
            className="modal__form-group-item"
            rules={[ruleRequired("Số lượng trẻ em không được để trống!")]}
          >
            <InputNumber min={0} placeholder="Nhập Số lượng trẻ em" />
          </Form.Item>
        </div>
        <div className="modal__form-group">
          <Form.Item
            name="customerEmail"
            label="Email"
            className="modal__form-group-item"
            rules={[ruleRequired("Email không được để trống!"), ruleEmail()]}
          >
            <Input placeholder="Nhập Email" />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default EmptyHandleOccupiedCustomerHasNotAccountComponent;
