import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { ShiftType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import CustomTimetable from "../../common/timetable";
import { shiftsToCells } from "../../../../utils/timetable";

// Manager Detail Shift
const ManagerDetailShift: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const [form] = Form.useForm<ShiftType>();

  console.log(data?.shiftDetails);

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id || undefined,
          name: data?.name || undefined,
          // shiftDetails: shiftsToCells(data?.shiftDetails) || undefined,
          status: data?.status || undefined,
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
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
            </div>
            <Form.Item
              label={defaultLabels.shiftDetails}
              className="modal__form-group-item multiple-3 margin-bottom-0"
            >
              <CustomTimetable
                viewMode="week"
                cells={shiftsToCells(data?.shiftDetails)}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailShift;
