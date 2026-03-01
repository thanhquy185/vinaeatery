import type { FC } from "react";
import { Popover, Tag, Progress } from "antd";
import type { PayslipMonth } from "../../../../common/types";
import { PayslipStatus } from "../../../../common/values";
import { getClassColorByPayslipStatus } from "./attendance-card";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

type AttendancePopoverMonthProps = {
  isTable: boolean;
  payslipMonth: PayslipMonth;
};

const AttendancePopoverMonth: FC<AttendancePopoverMonthProps> = ({
  isTable,
  payslipMonth,
}) => {
  const totalDays = payslipMonth.payslipDates.length;
  const totalPayslipShifts = payslipMonth.payslipDates.reduce(
    (total, payslipDate) => total + payslipDate.payslipShifts.length,
    0,
  );
  const totalPayslipShiftsTime = payslipMonth.payslipDates.reduce(
    (total, payslipDate) => total + payslipDate.totalTime,
    0,
  );
  const fullDays = payslipMonth.payslipDates.filter(
    (d) => d.status === PayslipStatus.full,
  ).length;
  const noFullDays = payslipMonth.payslipDates.filter(
    (d) => d.status === PayslipStatus.noFull,
  ).length;
  const absentDays = payslipMonth.payslipDates.filter(
    (d) => d.status === PayslipStatus.absent,
  ).length;
  const unknownDays = payslipMonth.payslipDates.filter(
    (d) => d.status === PayslipStatus.unknown,
  ).length;
  const completionPercent =
    totalDays > 0 ? Math.round((fullDays / totalDays) * 100) : 0;

  return (
    <Popover
      placement="left"
      content={
        <div className="attendance-month">
          <div className="summary">
            <p>
              <span>Tháng</span>
              <b>{payslipMonth.month}</b>
            </p>
            <p>
              <span>Giờ làm</span>
              <b>{payslipMonth.totalTime} giờ</b>
            </p>
            <p>
              <span>Trạng thái</span>
              <Tag
                color={
                  payslipMonth.totalStatus === PayslipStatus.full
                    ? "green-inverse"
                    : payslipMonth.totalStatus === PayslipStatus.noFull
                      ? "yellow-inverse"
                      : payslipMonth.totalStatus === PayslipStatus.absent
                        ? "red-inverse"
                        : "gray"
                }
              >
                {payslipMonth.totalStatus}
              </Tag>
            </p>
            <p>
              <span>Chi tiết từng ngày</span>
            </p>
            <div className="subs">
              <p className="sub">
                <span>Hoàn thành</span>
                <b>{completionPercent}%</b>
              </p>
              <Progress showInfo={false} percent={completionPercent} />
              <p className="sub">
                <span>- Tổng số ca làm</span>
                <b>{totalPayslipShifts}</b>
              </p>
              <p className="sub">
                <span>- Tổng giờ làm theo ca</span>
                <b>{totalPayslipShiftsTime} giờ</b>
              </p>
              <p className="sub">
                <span>- Làm đủ giờ</span>
                <b>{fullDays}</b>
              </p>
              <p className="sub">
                <span>- Làm thiếu giờ</span>
                <b>{noFullDays}</b>
              </p>
              <p className="sub">
                <span>- Không đi làm</span>
                <b>{absentDays}</b>
              </p>
              <p className="sub">
                <span>- Chưa xác nhận</span>
                <b>{unknownDays}</b>
              </p>
            </div>
            <div className="details">
              {payslipMonth.payslipDates.map((payslipDate) => {
                const shiftTotalTimes = payslipDate?.payslipShifts?.reduce(
                  (total, payslipShift) => total + payslipShift.time,
                  0,
                );

                return (
                  <div key={payslipDate.date} className="detail">
                    <div className="left">
                      <div className="name">{payslipDate.date}</div>
                      <div className="time">
                        {payslipDate.attendanceTime} / {shiftTotalTimes} giờ
                      </div>
                      <div className="salary">
                        {vietnamMoneyFormat(payslipDate.attendanceSalary)}
                      </div>
                    </div>
                    <div
                      className={`status ${getClassColorByPayslipStatus(
                        payslipDate.status,
                      )}`}
                    >
                      {payslipDate.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="divider" />
          <div className="salary">
            <p>
              <span>Lương tháng</span>
              <b className="salary">
                {vietnamMoneyFormat(payslipMonth.totalSalary || 0)}
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
            className={`attendance-month ${getClassColorByPayslipStatus(
              payslipMonth.totalStatus,
            )}`}
          >
            {vietnamMoneyFormat(payslipMonth.totalSalary || 0)}
          </div>
        )}
      </div>
    </Popover>
  );
};

export default AttendancePopoverMonth;
