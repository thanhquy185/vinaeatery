import { useEffect, useMemo, useState } from "react";
import { DatePicker, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type {
  ScheduleEmployeeType,
  ScheduleShiftType,
  ScheduleType,
} from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import CustomTimetable from "../../common/timetable";
import TableShifts from "./table-shifts";
import TableEmployees from "./table-employees";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateSchedule } from "../../../../requests/schedule";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { checkConflictSchedule } from "../../../../utils/check-conflict-schedule";
import dayjs from "dayjs";

// Manager Update Schedule
const ManagerUpdateSchedule: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  restaurantId,
  closeModal,
}) => {
  // Form
  const [form] = Form.useForm<ScheduleType>();
  // State
  const [selectedDateStart, setSelectedDateStart] = useState<string>();
  const [selectedDateEnd, setSelectedDateEnd] = useState<string>();
  const [selectedShiftIds, setSelectedShiftIds] = useState<number[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  // Memo
  const selectedShifts = useMemo(() => {
    return dataForCrud?.shifts
      ?.filter((shift) => selectedShiftIds.includes(shift?.id!))
      ?.map((shift) => ({
        shift,
      }));
  }, [selectedShiftIds]);
  const conflicts = useMemo(() => {
    return checkConflictSchedule(
      dataForCrud?.employees!,
      dataForCrud?.schedules?.filter(
        (schedule) =>
          schedule.id !== data?.id && schedule.status === CommonStatus.active,
      )!,
      selectedShifts?.map((selectedShift) => selectedShift?.shift)!,
      selectedDateStart,
      selectedDateEnd,
    );
  }, [
    dataForCrud?.employees!,
    dataForCrud?.schedules!,
    selectedShifts,
    selectedDateStart,
    selectedDateEnd,
  ]);
  // Effect
  useEffect(() => {
    setSelectedDateStart(data?.dateStart);
    setSelectedDateEnd(data?.dateEnd);
    setSelectedShiftIds(
      (data?.scheduleShifts as ScheduleShiftType[])?.flatMap(
        (scheduleShift) => scheduleShift?.shiftId!,
      ),
    );
    setSelectedEmployeeIds(
      (data?.scheduleEmployees as ScheduleEmployeeType[])?.flatMap(
        (scheduleEmployee) => scheduleEmployee?.employeeId!,
      ),
    );
  }, [data]);
  // Mutation
  const updateMutation = useEntityMutation<ScheduleType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateSchedule,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
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
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn thêm ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await updateMutation.mutateAsync({
              values: {
                ...values,
                restaurantId: restaurantId,
                dateStart:
                  values?.dateStart && dayjs(values?.dateStart).isValid()
                    ? dayjs(values?.dateStart).format("YYYY-MM-DD")
                    : undefined,
                dateEnd:
                  values?.dateEnd && dayjs(values?.dateEnd).isValid()
                    ? dayjs(values?.dateEnd).format("YYYY-MM-DD")
                    : undefined,
                scheduleEmployees: selectedEmployeeIds?.map(
                  (selectedEmployeeId) => ({
                    employeeId: selectedEmployeeId,
                  }),
                ),
                scheduleShifts: selectedShiftIds?.map((selectedShiftId) => ({
                  shiftId: selectedShiftId,
                })),
                updateAt: dayjs().format("YYYY-MM-DD"),
              },
            });
            if (response) {
              closeModal();
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }

          // Xoá class 'active' thể hiện nút không còn được nhấn
          submitButton?.classList.remove("active");
        }}
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
                <Input className="text-center" disabled />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
            </div>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Tên ca làm không được để trống!")]}
            >
              <Input placeholder={defaultInputs.name} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="dateStart"
                label={defaultLabels.dateStart}
                className="modal__form-group-item"
                rules={[ruleRequired("Cần chọn Ngày bắt đầu!")]}
              >
                <DatePicker
                  placeholder={defaultInputs.dateStart}
                  onChange={(val) =>
                    setSelectedDateStart(dayjs(val).format("YYYY-MM-DD"))
                  }
                />
              </Form.Item>
              <Form.Item
                name="dateEnd"
                label={defaultLabels.dateEnd}
                className="modal__form-group-item"
                rules={[ruleRequired("Cần chọn Ngày kết thúc!")]}
              >
                <DatePicker
                  placeholder={defaultInputs.dateEnd}
                  onChange={(val) =>
                    setSelectedDateEnd(dayjs(val).format("YYYY-MM-DD"))
                  }
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="note"
              label={defaultLabels.note}
              className="modal__form-group-item"
            >
              <TextArea
                placeholder={defaultInputs.note}
                className="multiple-2"
              />
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
                  selectedShiftIds={selectedShiftIds}
                  setSelectedShiftIds={setSelectedShiftIds}
                />
                <CustomTimetable
                  viewMode="week"
                  isSchedule={true}
                  isShowHeader={false}
                  isShowToday={false}
                  schedules={[
                    {
                      scheduleShifts: selectedShifts,
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
              className="modal__form-group-item multiple-3"
            >
              <div className="has-employees">
                <TableEmployees
                  employees={dataForCrud?.employees || []}
                  selectedEmployeeIds={selectedEmployeeIds}
                  setSelectedEmployeeIds={setSelectedEmployeeIds}
                  conflicts={conflicts}
                />
              </div>
            </Form.Item>
          </div>
          <div className="modal__form-group"></div>
          <div className="modal__form-group"></div>
        </div>
        <div className="modal__buttons">
          <button type="submit" className="modal__button btn update">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdateSchedule;
