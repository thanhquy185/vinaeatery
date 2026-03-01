import type { FC } from "react";
import { Popover, Tag } from "antd";
import type { PayslipDate } from "../../../../common/types";
import { PayslipStatus } from "../../../../common/values";
import {
  getClassColorAttendanceStatus,
  getClassColorByPayslipStatus,
} from "./attendance-card";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Attendance Popover Date Props
type AttendancePopoverDateProps = {
  isTable?: boolean;
  payslipDate: PayslipDate;
};

// Attendance Popover Date
const AttendancePopoverDate: FC<AttendancePopoverDateProps> = ({
  isTable = false,
  payslipDate,
}) => {
  return (
    <Popover
      placement="left"
      content={
        <div className="attendance-date">
          <div className="summary">
            <p>
              <span>Ngày</span>
              <b>{payslipDate.date}</b>
            </p>
            <p>
              <span>Giờ làm</span>
              <b>{payslipDate.attendanceTime} giờ</b>
            </p>
            <p>
              <span>Trạng thái</span>
              <Tag
                color={
                  payslipDate.status === PayslipStatus.full
                    ? "green-inverse"
                    : payslipDate.status === PayslipStatus.noFull
                      ? "yellow-inverse"
                      : payslipDate.status === PayslipStatus.absent
                        ? "red-inverse"
                        : "gray"
                }
              >
                {payslipDate.status}
              </Tag>
            </p>
            <p>
              <span>Chi tiết ca làm</span>
            </p>
            <div className="subs">
              <p className="sub">
                <span>- Tổng số ca làm</span>
                <b>{payslipDate.payslipShifts.length}</b>
              </p>
              <p className="sub">
                <span>- Tổng giờ làm theo ca</span>
                <b>{payslipDate.totalTime} giờ</b>
              </p>
            </div>
            <div className="details">
              {payslipDate.payslipShifts.map((payslipShift) => (
                <div key={payslipShift.id} className="detail">
                  <div className="left">
                    <div className="name">{payslipShift.name}</div>
                    <div className="time">{payslipShift.time} giờ</div>
                  </div>
                  <div
                    className={`status ${getClassColorAttendanceStatus(payslipShift.status)}`}
                  >
                    {payslipShift.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="divider" />
          <div className="salary">
            <p>
              <span>Lương ngày</span>
              <b className="salary">
                {vietnamMoneyFormat(payslipDate.attendanceSalary)}
              </b>
            </p>
          </div>
        </div>
      }
    >
      <div
        className={"attendance-wrapper" + (isTable ? " row-hover-trigger" : "")}
      >
        {!isTable && (
          <div
            className={`attendance-date ${getClassColorByPayslipStatus(
              payslipDate.status!,
            )}`}
          >
            {vietnamMoneyFormat(payslipDate.attendanceSalary)}
          </div>
        )}
      </div>
    </Popover>
  );
};

export default AttendancePopoverDate;
