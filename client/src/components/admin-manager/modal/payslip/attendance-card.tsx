import { useState, type FC } from "react";
import { Divider, Select } from "antd";
import { AttendanceStatus, PayslipStatus } from "../../../../common/values";
import { type ManagerHandlePayslipProps } from "./manager-handle-payslip";
import AttendanceCalendar from "./attendance-calendar";
import AttendanceTable from "./attendance-table";

// Utils
export const getClassColorByPayslipStatus = (status: string) => {
  if (status === PayslipStatus.full) return "green";
  if (status === PayslipStatus.noFull) return "yellow";
  if (status === PayslipStatus.absent) return "red";
  if (status === PayslipStatus.unknown) return "gray";
};
export const getClassColorAttendanceStatus = (status: string) => {
  if (status === AttendanceStatus.full) return "green";
  if (status === AttendanceStatus.half) return "yellow";
  if (status === AttendanceStatus.absent) return "red";
  if (status === AttendanceStatus.pending) return "gray";
};

// Attendance Card
const AttendanceCard: FC<ManagerHandlePayslipProps> = ({
  timeline,
  timeDetailDateStart,
  timeDetailDateEnd,
  data,
}) => {
  // Các thành phần để sử dụng cho Chấm công
  // - Loại bảng
  const [attendanceType, setAttendanceType] = useState<"calendar" | "table">(
    "calendar",
  );

  return (
    <div className="attendance card">
      <p className="title">Chấm công</p>
      <Divider />
      {timeDetailDateStart && timeDetailDateEnd ? (
        <>
          <div className="row">
            <Select
              options={[
                {
                  label: "Theo lịch",
                  value: "calendar",
                },
                {
                  label: "Theo bảng",
                  value: "table",
                },
              ]}
              value={attendanceType}
              onChange={(val) => setAttendanceType(val as "calendar" | "table")}
            />
            <div className="notes">
              <p className="note">
                <span className="dot green"></span>
                {PayslipStatus.full}
              </p>
              <p className="note">
                <span className="dot yellow"></span>
                {PayslipStatus.noFull}
              </p>
              <p className="note">
                <span className="dot red"></span>
                {PayslipStatus.absent}
              </p>
              <p className="note">
                <span className="dot gray"></span>
                {PayslipStatus.unknown}
              </p>
            </div>
          </div>
          {attendanceType === "calendar" ? (
            <AttendanceCalendar
              timeline={timeline}
              calendarValue={timeDetailDateStart}
              data={data}
            />
          ) : (
            <AttendanceTable timeline={timeline} data={data} />
          )}
          <p className="note">
            *Lưu ý: Di chuyển chuột vào ô (hoặc dòng) để xem chi tiết
          </p>
        </>
      ) : (
        <>CẦN XỬ LÝ ĐỂ HIỂN THỊ TOÀN BỘ TỪ TRƯỚC ĐẾN NAY VỀ TIỀN LƯƠNG</>
      )}
    </div>
  );
};

export default AttendanceCard;
