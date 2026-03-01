import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { OrderTableType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import dayjs from "dayjs";

// Manager Detail Order Table
const ManagerDetailOrderTable: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<OrderTableType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id!,
          createAt: dayjs(data?.createAt!),
          arriveAt: dayjs(data?.arriveAt!),
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
              className="modal__form-group-item margin-bottom-0"
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
              className="modal__form-group-item margin-bottom-0"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="customerNote"
              label={defaultLabels.customerNote}
              className="modal__form-group-item margin-bottom-0"
            >
              <TextArea className="multiple-2" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailOrderTable;
