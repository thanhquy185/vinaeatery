import { type FC } from "react";
import { Calendar } from "antd";
import type { PayslipDate, PayslipMonth } from "../../../../common/types";
import ConfigVN from "../../../common/config-vn";
import type { ManagerHandlePayslipProps } from "./manager-handle-payslip";
import AttendancePopoverMonth from "./attendance-popover-month";
import AttendancePopoverDate from "./attendance-popover-date";

// Attendance Calendar
const AttendanceCalendar: FC<ManagerHandlePayslipProps> = ({
  timeline,
  calendarValue,
  data,
}) => {
  return (
    <ConfigVN
      children={
        <Calendar
          mode={timeline}
          headerRender={() => null}
          value={calendarValue}
          cellRender={(value) => {
            const key =
              timeline === "year"
                ? value.format("YYYY-MM")
                : value.format("YYYY-MM-DD");

            if (timeline === "year") {
              const payslipMonth = (
                data?.salaryAttendanceData as PayslipMonth[]
              )?.find((payslipMonth) => payslipMonth?.month === key);
              if (!payslipMonth) return null;

              return <AttendancePopoverMonth payslipMonth={payslipMonth} />;
            }

            const payslipDate = (
              data?.salaryAttendanceData as PayslipDate[]
            )?.find((payslipDate) => payslipDate?.date === key);
            if (!payslipDate) return null;

            return <AttendancePopoverDate payslipDate={payslipDate} />;
          }}
        />
      }
    />
  );
};

export default AttendanceCalendar;
