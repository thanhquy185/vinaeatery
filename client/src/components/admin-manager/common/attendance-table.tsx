import { useMemo, type FC } from "react";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type {
  AttendanceTableType,
  AttendanceType,
  ScheduleType,
} from "../../../common/types";
import {
  AttendanceStatus,
  EmployeeStatus,
  ImageSourcePath,
} from "../../../common/values";
import ManagerHandleAttendance, {
  type ManagerHandleAttendanceProps,
} from "../modal/attendance/manager-handle-attendance";
import CustomTableActions from "../../common/table-actions";
import CustomModal from "../../common/modal";
import { useModal } from "../../../hook/use-modal";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Các hàm xử lý
// - Hàm lấy ra danh sách các ngày trong tuần
function getDatesInRange(dateStart: string, dateEnd: string) {
  const days: dayjs.Dayjs[] = [];

  let current = dayjs(dateStart);
  const end = dayjs(dateEnd);

  while (current.isBefore(end, "day") || current.isSame(end, "day")) {
    days.push(current);
    current = current.add(1, "day");
  }

  return days;
}

// Custom Attendance Table Props
interface CustomAttendanceTableProps {
  nameEN?: string;
  restaurantId?: number;
  dateStart?: string;
  dateEnd?: string;
  attendanceTables?: AttendanceTableType[];
}

// Custom Attendance Table
const CustomAttendanceTable: FC<CustomAttendanceTableProps> = ({
  nameEN,
  restaurantId,
  dateStart: initDateStart = dayjs().startOf("month"),
  dateEnd: initDateEnd = dayjs().endOf("month"),
  attendanceTables = [],
}) => {
  // Danh sách các ngày
  const dates = useMemo(
    () => getDatesInRange(initDateStart as string, initDateEnd as string),
    [initDateStart, initDateEnd],
  );

  // Cột bảng
  const columns: ColumnsType<any> = useMemo(() => {
    const dayColumns: ColumnType<any>[] = dates.map((date) => {
      const d = dayjs(date);
      const dayIndex = d.day();

      return {
        title: (
          <div
            className={`day-header ${dayIndex === 0 || dayIndex === 6 ? "weekend" : ""}`}
          >
            <span className="day-name">
              {dayIndex === 0 ? "CN" : `Thứ ${dayIndex + 1}`}
            </span>
            <span className="day-date">{d.format("DD")}</span>
          </div>
        ),
        key: d.format("YYYY-MM-DD"),
        width: 200,
        align: "center",
        render: (_value, record) => {
          const filteredShifts =
            (record?.schedules as ScheduleType[])?.flatMap((schedule) => {
              const inDateRange =
                dayjs(d).isSameOrAfter(dayjs(schedule.dateStart)) &&
                dayjs(d).isSameOrBefore(dayjs(schedule.dateEnd));
              if (!inDateRange) return [];

              return schedule.scheduleShifts?.flatMap((scheduleShift) =>
                scheduleShift.shift?.shiftDetails?.some(
                  (detail) =>
                    detail.dayOfWeek === dayIndex ||
                    (detail.dayOfWeek === 7 && dayIndex === 0),
                )
                  ? [scheduleShift.shift]
                  : [],
              );
            }) ?? [];
          if (!filteredShifts.length) return null;

          const filteredAttendances =
            (record?.attendances as AttendanceType[])?.filter((att) =>
              dayjs(att.date).isSame(d, "day"),
            ) ?? [];

          return (
            <div className="attendance-cell">
              {filteredShifts.map((shift) => {
                const shiftDetails =
                  shift?.shiftDetails?.filter(
                    (shiftDetail) =>
                      shiftDetail.dayOfWeek === dayIndex ||
                      (shiftDetail.dayOfWeek === 7 && dayIndex === 0),
                  ) ?? [];
                const attendanceEmployee = filteredAttendances.find(
                  (att) => att.shiftId === shift?.id,
                );

                const statusClass =
                  attendanceEmployee?.status === AttendanceStatus.full
                    ? "green"
                    : attendanceEmployee?.status === AttendanceStatus.half
                      ? "yellow"
                      : attendanceEmployee?.status === AttendanceStatus.absent
                        ? "red"
                        : "gray";

                return (
                  <div
                    key={shift?.id}
                    className="shift-cell"
                    onClick={() =>
                      openModal({
                        title: "Chấm công nhân viên",
                        width: "40%",
                        className: `default ${nameEN}`,
                        children: ManagerAttendanceModals.handle({
                          nameEN: nameEN!,
                          restaurantId: restaurantId!,
                          date: d,
                          employee: record.employee!,
                          shift: shift!,
                          shiftDetails: shiftDetails!,
                          attendance: attendanceEmployee!,
                        }),
                      })
                    }
                  >
                    <p className="shift">
                      <span className={`dot ${statusClass}`} />
                      <span className="name">{shift?.name}</span>
                    </p>
                    {shiftDetails.map((shiftDetail, index) => (
                      <>
                        <p className="time" key={index}>
                          <span
                            className={
                              shiftDetails.length > 1 && index !== 0
                                ? "hidden"
                                : ""
                            }
                          >
                            TG:
                          </span>
                          <span>{shiftDetail.timeStart}</span>
                          <span> - </span>
                          <span>{shiftDetail.timeEnd}</span>
                        </p>
                        {attendanceEmployee?.checkIn &&
                          attendanceEmployee?.checkOut && (
                            <p className="time">
                              <span>CC:</span>
                              <span
                                className={
                                  dayjs(
                                    attendanceEmployee.checkIn,
                                    "HH:mm",
                                  ).isSameOrBefore(
                                    dayjs(shiftDetail.timeStart, "HH:mm"),
                                  )
                                    ? "green"
                                    : "red"
                                }
                              >
                                {attendanceEmployee.checkIn}
                              </span>
                              <span> - </span>
                              <span
                                className={
                                  dayjs(
                                    attendanceEmployee.checkOut,
                                    "HH:mm",
                                  ).isSameOrAfter(
                                    dayjs(shiftDetail.timeEnd, "HH:mm"),
                                  )
                                    ? "green"
                                    : "red"
                                }
                              >
                                {attendanceEmployee.checkOut}
                              </span>
                            </p>
                          )}
                        {attendanceEmployee?.leave && (
                          <p className="leave">{attendanceEmployee?.leave}</p>
                        )}
                      </>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        },
      };
    });

    return [
      {
        title: "Nhân viên / Ngày",
        key: "employee",
        fixed: "left",
        align: "center",
        width: 250,
        render: (_v, record: any) => (
          <div className="employee-cell">
            <img
              src={record.employee.image || ImageSourcePath + "no-image.png"}
            />
            <div>
              <p className="name">{record.employee.fullname}</p>
              <p className="other">
                <span>#{record.employee.id}</span>
                <span className="dot" />
                <span
                  className={
                    "status " +
                    (record.employee.status === EmployeeStatus.active
                      ? "green"
                      : "red")
                  }
                >
                  {record.employee.status}
                </span>
              </p>
            </div>
          </div>
        ),
      },
      ...dayColumns,
    ];
  }, [dates]);

  // Modal
  const { modal, openModal, closeModal } = useModal();
  const ManagerAttendanceModals = {
    handle: ({
      nameEN,
      restaurantId,
      date,
      employee,
      shift,
      shiftDetails,
      attendance,
    }: ManagerHandleAttendanceProps) => (
      <ManagerHandleAttendance
        nameEN={nameEN}
        restaurantId={restaurantId}
        date={date}
        employee={employee}
        shift={shift}
        shiftDetails={shiftDetails}
        attendance={attendance}
        closeModal={closeModal}
      />
    ),
  };

  return (
    <>
      <CustomTableActions
        className="attendance-table"
        columns={columns}
        data={attendanceTables}
        rowKey={(r) => String(r.employee.id)}
        bordered
        isScroll={true}
      />
      {modal.open && (
        <CustomModal
          title={modal.title}
          open={modal.open}
          width={modal.width}
          className={modal.className}
          children={modal.children}
          setCloseModal={() => closeModal()}
        />
      )}
    </>
  );
};

export default CustomAttendanceTable;
