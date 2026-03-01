import type { FC } from "react";
import { DatePicker, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { PermissionTicketType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import dayjs from "dayjs";

// Manager Detail Permission Ticket
const ManagerDetailPermissionTicket: FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
  dataForCrud,
}) => {
  const [form] = Form.useForm<PermissionTicketType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id! || undefined,
          createAt: data?.createAt! || undefined,
          employeeHandle: data?.employeeHandle!
            ? "#" +
              data?.employeeHandle!.id +
              " - " +
              data?.employeeHandle!.fullname +
              " - " +
              data?.employeeHandle!.phone +
              " - " +
              data?.employeeHandle!.email
            : undefined,
          employeeMain: data?.employeeMain!
            ? "#" +
              data?.employeeMain!.id +
              " - " +
              data?.employeeMain!.fullname +
              " - " +
              data?.employeeMain!.phone +
              " - " +
              data?.employeeMain!.email
            : undefined,
          categoryPermissionTicket: data?.categoryPermissionTicket!
            ? "#" +
              data?.categoryPermissionTicket!.id +
              " - " +
              data?.categoryPermissionTicket!.name
            : undefined,
          date: data?.date ? dayjs(data.date, "YYYY-MM-DD") : undefined,
          reason: data?.reason! || undefined,
          status: data?.status! || undefined,
        }}
        className="modal__form split-3"
        disabled
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title}</p>
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
            <Form.Item
              name="categoryPermissionTicket"
              label={defaultLabels.categoryPermissionTicket}
              className="modal__form-group-item"
            >
              <Select />
            </Form.Item>
            <Form.Item
              name="date"
              label={defaultLabels.date}
              className="modal__form-group-item margin-bottom-0"
            >
              <DatePicker />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="employeeHandle"
              label={defaultLabels.employeeHandle}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="employeeMain"
              label={defaultLabels.employeeMain}
              className="modal__form-group-item multiple-2"
            >
              <Select />
            </Form.Item>
            <Form.Item
              name="reason"
              label={defaultLabels.reason}
              className="modal__form-group-item multiple-2 margin-bottom-0"
            >
              <TextArea className="multiple-2" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailPermissionTicket;
