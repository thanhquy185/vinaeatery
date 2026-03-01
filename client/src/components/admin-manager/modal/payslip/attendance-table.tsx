import { useMemo, type FC } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PayslipDate, PayslipMonth } from "../../../../common/types";
import { PayslipStatus } from "../../../../common/values";
import type { ManagerHandlePayslipProps } from "./manager-handle-payslip";
import AttendancePopoverMonth from "./attendance-popover-month";
import AttendancePopoverDate from "./attendance-popover-date";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

const getRowClassNameByPayslipStatus = (record: any) => {
  const statusValue = record.status || record.totalStatus;
  if (statusValue === PayslipStatus.full) return "green";
  if (statusValue === PayslipStatus.noFull) return "yellow";
  if (statusValue === PayslipStatus.absent) return "red";
  if (statusValue === PayslipStatus.unknown) return "gray";

  return statusValue;
};

// Attendance Table
const AttendanceTable: FC<ManagerHandlePayslipProps> = ({ timeline, data }) => {
  const columns: ColumnsType<any> = useMemo(() => {
    return timeline === "year"
      ? [
          {
            title: "",
            key: "trigger",
            render: (_, record) => (
              <AttendancePopoverMonth isTable={true} payslipMonth={record} />
            ),
          },
          {
            title: "Tháng",
            dataIndex: "month",
            key: "month",
            align: "center",
          },
          {
            title: "Ca làm",
            key: "shifts",
            align: "center",
            render: (record: PayslipMonth) => {
              const totalPayslipShifts = record.payslipDates.reduce(
                (total, payslipDate) =>
                  total + payslipDate.payslipShifts.length,
                0,
              );
              const totalPayslipShiftsTime = record.payslipDates.reduce(
                (total, payslipDate) => total + payslipDate.totalTime,
                0,
              );

              return `${totalPayslipShifts} (${totalPayslipShiftsTime}h)`;
            },
          },
          {
            title: "Giờ làm",
            dataIndex: "totalTime",
            key: "totalTime",
            align: "center",
            render: (totalTime) => `${totalTime}h`,
          },
          {
            title: "Lương tháng",
            dataIndex: "totalSalary",
            key: "totalSalary",
            align: "center",
            render: (totalSalary) => vietnamMoneyFormat(totalSalary),
          },
        ]
      : [
          {
            title: "",
            key: "trigger",
            render: (_, record) => (
              <AttendancePopoverDate isTable={true} payslipDate={record} />
            ),
          },
          {
            title: "Ngày",
            dataIndex: "date",
            key: "date",
            align: "center",
          },
          {
            title: "Ca làm",
            key: "shifts",
            align: "center",
            render: (record: PayslipDate) =>
              `${record.payslipShifts.length} (${record.totalTime}h)`,
          },
          {
            title: "Giờ làm",
            dataIndex: "attendanceTime",
            key: "attendanceTime",
            align: "center",
            render: (attendanceTime) => `${attendanceTime}h`,
          },
          {
            title: "Lương ngày",
            dataIndex: "attendanceSalary",
            key: "attendanceSalary",
            align: "center",
            render: (attendanceSalary) => vietnamMoneyFormat(attendanceSalary),
          },
        ];
  }, [timeline]);
  const summaryData = useMemo(() => {
    const salaryData = data?.salaryAttendanceData || [];

    return salaryData.reduce(
      (acc: any, item: any) => {
        acc.totalPayslipShifts +=
          timeline === "year"
            ? (item.payslipDates as PayslipDate[]).reduce(
                (total, payslipDate) =>
                  total + payslipDate.payslipShifts.length,
                0,
              )
            : item.payslipShifts?.length || 0;
        acc.totalPayslipShiftsTime +=
          timeline === "year"
            ? (item.payslipDates as PayslipDate[]).reduce(
                (total, payslipDate) => total + payslipDate.totalTime,
                0,
              )
            : item.totalTime;
        acc.totalAttendanceTime +=
          timeline === "year" ? item.totalTime : item.attendanceTime || 0;
        acc.totalAttendanceSalary +=
          timeline === "year" ? item.totalSalary : item.attendanceSalary || 0;
        return acc;
      },
      {
        totalPayslipShifts: 0,
        totalPayslipShiftsTime: 0,
        totalAttendanceTime: 0,
        totalAttendanceSalary: 0,
      },
    );
  }, [data]);

  return (
    <Table
      columns={columns}
      dataSource={data.salaryAttendanceData}
      rowKey="date"
      pagination={false}
      rowClassName={getRowClassNameByPayslipStatus}
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2}>
            <b>TỔNG</b>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">
            <b>
              {summaryData.totalPayslipShifts} (
              {summaryData.totalPayslipShiftsTime}h)
            </b>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="center">
            <b>{summaryData.totalAttendanceTime}h</b>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} align="center">
            <b style={{ color: "#16a34a" }}>
              {vietnamMoneyFormat(summaryData.totalAttendanceSalary)}
            </b>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
      className="table-attendance"
    />
  );
};

export default AttendanceTable;
