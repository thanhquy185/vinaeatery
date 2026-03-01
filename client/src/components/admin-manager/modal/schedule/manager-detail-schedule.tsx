import { Form, Input, Select, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type {
  ScheduleEmployeeType,
  ScheduleShiftType,
  ScheduleType,
} from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import CustomTimetable from "../../common/timetable";
import TableShifts from "./table-shifts";
import TableEmployees from "./table-employees";
import dayjs from "dayjs";

// Manager Detail Schedule
const ManagerDetailSchedule: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
  dataForCrud,
}) => {
  const [form] = Form.useForm<ScheduleType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id! || undefined,
          name: data?.name! || undefined,
          dateStart: data?.dateStart
            ? dayjs(data.dateStart, "YYYY-MM-DD")
            : undefined,
          dateEnd: data?.dateEnd
            ? dayjs(data.dateEnd, "YYYY-MM-DD")
            : undefined,
          note: data?.note! || undefined,
          status: data?.status! || undefined,
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
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="dateStart"
                label={defaultLabels.dateStart}
                className="modal__form-group-item"
              >
                <DatePicker />
              </Form.Item>
              <Form.Item
                name="dateEnd"
                label={defaultLabels.dateEnd}
                className="modal__form-group-item"
              >
                <DatePicker />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="note"
              label={defaultLabels.note}
              className="modal__form-group-item"
            >
              <TextArea className="multiple-2" />
            </Form.Item>
          </div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title2}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.scheduleShifts}
              className="modal__form-group-item multiple-3"
            >
              <div className="has-timetable">
                <TableShifts
                  shifts={dataForCrud?.shifts || []}
                  selectedShiftIds={(
                    data?.scheduleShifts as ScheduleShiftType[]
                  )?.flatMap((scheduleShift) => scheduleShift?.shiftId!)}
                />
                <CustomTimetable
                  viewMode="week"
                  isSchedule={true}
                  isShowHeader={false}
                  isShowToday={false}
                  schedules={[
                    {
                      scheduleShifts: dataForCrud?.shifts
                        ?.filter((shift) =>
                          (data?.scheduleShifts as ScheduleShiftType[])
                            ?.flatMap(
                              (scheduleShift) => scheduleShift?.shiftId!,
                            )
                            .includes(shift?.id!),
                        )
                        ?.map((shift) => ({
                          shift,
                        })),
                    },
                  ]}
                />
              </div>
            </Form.Item>
          </div>
          <div className="modal__form-group"></div>
          <div className="modal__form-group"></div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title3}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.scheduleEmployees}
              className="modal__form-group-item multiple-3 margin-bottom-0"
            >
              <div className="has-employees">
                <TableEmployees
                  hideSelectAll={true}
                  employees={dataForCrud?.employees || []}
                  selectedEmployeeIds={(
                    data?.scheduleEmployees as ScheduleEmployeeType[]
                  )?.flatMap(
                    (scheduleEmployee) => scheduleEmployee?.employeeId!,
                  )}
                />
              </div>
            </Form.Item>
          </div>
          <div className="modal__form-group"></div>
          <div className="modal__form-group"></div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailSchedule;
