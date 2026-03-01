import type { FC } from "react";
import type {
  AttendanceType,
  EmployeeType,
  ShiftDetailType,
  ShiftType,
} from "../../../../common/types";
import { Divider, Form, Select, Tag, TimePicker } from "antd";
import {
  AttendanceLeave,
  AttendanceStatus,
  EmployeeStatus,
  ImageSourcePath,
  MachineLogAction,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import { ruleRequired } from "../../../../common/rules";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import {
  HandleCreateAttendance,
  HandleUpdateAttendance,
} from "../../../../requests/attendances";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs, { Dayjs } from "dayjs";

// Manager Handle Attendance Props
export type ManagerHandleAttendanceProps = {
  nameEN: string;
  restaurantId: number;
  date: Dayjs;
  employee: EmployeeType;
  shift: ShiftType;
  shiftDetails: ShiftDetailType[];
  attendance: AttendanceType;
  closeModal?: () => void;
};

// Manager Handle Attendance
const ManagerHandleAttendance: FC<ManagerHandleAttendanceProps> = ({
  nameEN,
  restaurantId,
  date,
  employee,
  shift,
  shiftDetails,
  attendance,
  closeModal,
}) => {
  const [form] = Form.useForm<AttendanceType>();
  const updateMutation = useEntityMutation<AttendanceType>({
    messages: {
      success: `Cập nhật chấm công nhân viên thành công!`,
      error: `Cập nhật chấm công nhân viên thất bại!`,
    },
    invalidateKeys: [[nameEN]],
    api: !attendance ? HandleCreateAttendance : HandleUpdateAttendance,
  });

  const machineLogs: any[] = [
    // {
    //   id: 1,
    //   employee: {
    //     id: 1,
    //     fullname: "Nguyễn Văn A",
    //   },
    //   shift: {
    //     id: 1,
    //     name: "Ca sáng",
    //     startTime: "07:00",
    //     endTime: "11:00",
    //   },
    //   time: "07:18:20",
    //   action: MachineLogAction.in,
    // },
    // {
    //   id: 2,
    //   employee: {
    //     id: 1,
    //     fullname: "Nguyễn Văn A",
    //   },
    //   shift: {
    //     id: 1,
    //     name: "Ca sáng",
    //     startTime: "07:00",
    //     endTime: "11:00",
    //   },
    //   time: "10:20:08",
    //   action: MachineLogAction.out,
    // },
  ];

  return (
    <>
      <div className="info employee">
        <img
          src={
            employee?.image
              ? (employee?.image as string)
              : ImageSourcePath + "no-image.png"
          }
          alt=""
        />
        <div>
          <p className="name">{employee.fullname}</p>
          <p className="other">
            <span>#{employee.id}</span>
            <span className="dot" />
            <span
              className={
                "status " +
                (employee.status === EmployeeStatus.active ? "green" : "red")
              }
            >
              {employee.status}
            </span>
          </p>
        </div>
      </div>
      <Divider />
      <div className="info">
        <p className="title">Thông tin ca làm</p>
        <p>
          <span>- Tên ca:</span>
          <b>{shift.name}</b>
        </p>
        <p>
          <span>- Thời gian:</span>
          {shiftDetails.map((shiftDetail, index) => (
            <b key={index}>
              {shiftDetail.timeStart} - {shiftDetail.timeEnd}
            </b>
          ))}
        </p>
        <p>
          <span>- Ngày chấm công:</span>
          <b>{date.format("DD/MM/YYYY")}</b>
        </p>
      </div>
      <Divider />
      <div className="info machine-log">
        <p className="title">Lịch sử từ máy</p>
        {machineLogs.length > 0 ? (
          <div className="list">
            {machineLogs.map((log) => (
              <div key={log.id} className="item">
                <p>
                  <b>{log.time}</b>
                </p>
                <div className="content">
                  <p className="shift">
                    {log.shift?.name} ({log.shift?.startTime} -{" "}
                    {log.shift?.endTime})
                  </p>
                  <Tag
                    color={log.action === MachineLogAction.in ? "green" : "red"}
                    className="action"
                  >
                    {[log.action]}
                  </Tag>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="inform">
            <img
              src={ImageSourcePath + "attendance-machine-icon.png"}
              alt="attendance-machine-icon"
            />
            <h3>Chưa có dữ liệu chấm công</h3>
            <p>Dữ liệu sẽ hiển thị khi nhân viên quẹt thẻ tại máy</p>
          </div>
        )}
      </div>
      <Divider />
      <div className="info">
        <p className="title">Chấm công thủ công</p>
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={{
            checkIn: attendance?.checkIn
              ? dayjs(attendance?.checkIn, "HH:mm")
              : undefined,
            checkOut: attendance?.checkOut
              ? dayjs(attendance?.checkOut, "HH:mm")
              : undefined,
            leave: attendance?.leave || undefined,
            status: attendance?.status || undefined,
          }}
          className="modal__form"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn cập nhật ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              const response = await updateMutation.mutateAsync({
                values: !attendance
                  ? {
                      ...values,
                      restaurantId: restaurantId,
                      employeeId: employee?.id || undefined,
                      shiftId: shift?.id || undefined,
                      date:
                        date && dayjs(date).isValid()
                          ? dayjs(date).format("YYYY-MM-DD")
                          : undefined,
                      checkIn:
                        values?.checkIn && dayjs(values?.checkIn).isValid()
                          ? dayjs(values?.checkIn).format("HH:mm")
                          : undefined,
                      checkOut:
                        values?.checkOut && dayjs(values?.checkOut).isValid()
                          ? dayjs(values?.checkOut).format("HH:mm")
                          : undefined,
                    }
                  : {
                      ...values,
                      id: attendance?.id || undefined,
                      checkIn:
                        values?.checkIn && dayjs(values?.checkIn).isValid()
                          ? dayjs(values?.checkIn).format("HH:mm")
                          : undefined,
                      checkOut:
                        values?.checkOut && dayjs(values?.checkOut).isValid()
                          ? dayjs(values?.checkOut).format("HH:mm")
                          : undefined,
                    },
              });
              if (data) {
                closeModal!();
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  htmlFor="handle-status"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Trạng thái!")]}
                >
                  <Select
                    allowClear
                    id="handle-status"
                    placeholder="Chọn Trạng thái"
                    options={[
                      {
                        label: AttendanceStatus.full,
                        value: AttendanceStatus.full,
                      },
                      {
                        label: AttendanceStatus.half,
                        value: AttendanceStatus.half,
                      },
                      {
                        label: AttendanceStatus.absent,
                        value: AttendanceStatus.absent,
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="leave"
                  label="Lý do nghỉ"
                  htmlFor="handle-leave"
                  className="modal__form-group-item"
                >
                  <Select
                    allowClear
                    id="handle-leave"
                    placeholder="Chọn Lý do nghỉ"
                    options={[
                      {
                        label: AttendanceLeave.paid,
                        value: AttendanceLeave.paid,
                      },
                      {
                        label: AttendanceLeave.unpaid,
                        value: AttendanceLeave.unpaid,
                      },
                      {
                        label: AttendanceLeave.sick,
                        value: AttendanceLeave.sick,
                      },
                      {
                        label: AttendanceLeave.family,
                        value: AttendanceLeave.family,
                      },
                      {
                        label: AttendanceLeave.work,
                        value: AttendanceLeave.work,
                      },
                    ]}
                  />
                </Form.Item>
              </div>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="checkIn"
                  htmlFor="handle-checkIn"
                  label="Check-in"
                  className="modal__form-group-item"
                >
                  <TimePicker
                    showSecond={false}
                    id="handle-checkIn"
                    placeholder="Chọn Thời gian"
                  />
                </Form.Item>
                <Form.Item
                  name="checkOut"
                  htmlFor="handle-checkOut"
                  label="Check-out"
                  className="modal__form-group-item"
                >
                  <TimePicker
                    showSecond={false}
                    id="handle-checkOut"
                    placeholder="Chọn Thời gian"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn">
              Cập nhật
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ManagerHandleAttendance;
