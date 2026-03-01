import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import type { CrudObjectModalProps } from "../../../../common/props";
import type {
  AttendanceType,
  PayslipDate,
  PayslipMonth,
  RewardPunishType,
  RoleHistoryType,
  ScheduleType,
} from "../../../../common/types";
import { PayslipStatus } from "../../../../common/values";
import ProfileCard from "./profile-card";
import FilterCard from "./filter-card";
import RoleHistoryCard from "./role-history-card";
import AttendanceCard from "./attendance-card";
import RewardPunishCard from "./reward-punish-card";
import SummaryCard from "./summary-card";
import {
  calPayslipMonth,
  checkDateEqual,
  checkDateStartEndEqual,
  generatePayslipShifts,
  generateTimelineByDateStartEnd,
  generateTimelineData,
} from "../../../../utils/payslip-events";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.locale("vi");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Manager Handle Payslip Props
export type ManagerHandlePayslipProps = {
  objectEN?: string;
  timeline?: "year" | "month" | undefined;
  setTimeline?: Dispatch<SetStateAction<"year" | "month" | undefined>>;
  timeDetail?: Dayjs | undefined;
  setTimeDetail?: Dispatch<SetStateAction<Dayjs | undefined>>;
  calendarValue?: Dayjs;
  timeDetailDateStart?: Dayjs;
  timeDetailDateEnd?: Dayjs;
  data?: any;
};

// Manager Handle Payslip
const ManagerHandlePayslip: FC<CrudObjectModalProps> = ({
  objectEN,
  data,
  closeModal,
}) => {
  // Các thành phần để lọc thời gian
  // - Mốc thời gian
  const [timeline, setTimeline] = useState<"year" | "month" | undefined>(
    undefined,
  );
  // - Thời gian cụ thể
  const [timeDetail, setTimeDetail] = useState<Dayjs | undefined>(undefined);
  // - Ngày bắt đầu / kết thúc từ thời gian cụ thể
  const [timeDetailDateStartValue, settimeDetailDateStartValue] = useState<
    Dayjs | undefined
  >(undefined);
  const [timeDetailDateEndValue, settimeDetailDateEndValue] = useState<
    Dayjs | undefined
  >(undefined);
  // -
  useEffect(() => {
    if (!timeline || !timeDetail) {
      settimeDetailDateStartValue(undefined);
      settimeDetailDateEndValue(undefined);

      return;
    }

    settimeDetailDateStartValue(timeDetail.startOf(timeline));
    settimeDetailDateEndValue(timeDetail.endOf(timeline));
  }, [timeline, timeDetail]);

  // Các thành phần để hiển thị dữ liệu
  // - Thời gian
  const timelineData = useMemo(() => {
    if (!timeline || !timeDetail) return [];

    return generateTimelineData({
      timeline: timeline,
      timeDetail: dayjs(timeDetail).format(
        timeline === "year" ? "YYYY" : "YYYY-MM",
      ),
    });
  }, [timeline, timeDetail]);
  // - Lịch sử chức vụ
  const filteredRoleHistories = useMemo(() => {
    return (data?.employee?.roleHistories as RoleHistoryType[])?.filter(
      (roleHistory) =>
        checkDateStartEndEqual({
          dateStart: roleHistory?.dateStart!,
          dateEnd: roleHistory?.dateEnd!,
          timeDetail: timeDetail!,
          format: timeline === "year" ? "YYYY" : "YYYY-MM",
        }),
    );
  }, [timeline, timeDetail]);
  // - Lịch làm
  const filteredSchedules = useMemo(() => {
    return (data?.schedules as ScheduleType[])?.filter((schedule) =>
      checkDateStartEndEqual({
        dateStart: schedule?.dateStart!,
        dateEnd: schedule?.dateEnd!,
        timeDetail: timeDetail!,
        format: timeline === "year" ? "YYYY" : "YYYY-MM",
      }),
    );
  }, [timeline, timeDetail]);
  // - Chấm công
  const filteredAttendances = useMemo(() => {
    return (data?.attendances as AttendanceType[])?.filter((attendance) =>
      checkDateEqual({
        date: attendance?.date!,
        timeDetail: timeDetail!,
        format: timeline === "year" ? "YYYY" : "YYYY-MM",
      }),
    );
  }, [timeline, timeDetail]);
  // // - Đơn xin phép
  // const filteredPermissionTickets = useMemo(() => {
  //   return (data?.permissionTickets as PermissionTicketType[])?.filter(
  //     (permissionTicket) =>
  //       checkDateEqual({
  //         date: permissionTicket?.date!,
  //         timeDetail: timeDetail!,
  //         format: timeline === "year" ? "YYYY" : "YYYY-MM",
  //       }),
  //   );
  // }, [timeline, timeDetail]);
  // - Thưởng - Phạt
  const filteredRewardPunishes = useMemo(() => {
    return (data?.rewardPunishes as RewardPunishType[])?.filter(
      (rewardPunish) =>
        checkDateEqual({
          date: rewardPunish?.date!,
          timeDetail: timeDetail!,
          format: timeline === "year" ? "YYYY" : "YYYY-MM",
        }),
    );
  }, [timeline, timeDetail]);
  // - Tiền lương
  const filteredSalaryDatas = useMemo(() => {
    return (data?.salaryDatas as PayslipDate[])?.filter((salaryData) =>
      checkDateEqual({
        date: salaryData?.date!,
        timeDetail: timeDetail!,
        format: timeline === "year" ? "YYYY" : "YYYY-MM",
      }),
    );
  }, [timeline, timeDetail]);
  // - Tiền lương hiển thị với bảng chấm công
  const salaryAttendanceData = useMemo(() => {
    if (
      !timeDetailDateStartValue &&
      !timeDetailDateEndValue &&
      !timelineData.length &&
      !filteredSalaryDatas.length
    )
      return [];

    const salaryAttendanceDataFinal = timelineData?.map((td) => {
      if (timeline === "year") {
        const month = dayjs((td as { month: string })?.month);
        const payslipDates = filteredSalaryDatas?.filter((filteredSalaryData) =>
          checkDateEqual({
            date: filteredSalaryData.date,
            timeDetail: month,
            format: "YYYY-MM",
          }),
        );
        const dateStart = month.startOf("month");
        const dateEnd = month.endOf("month");
        const datesInMonth = generateTimelineByDateStartEnd({
          dateStart: dateStart.format("YYYY-MM-DD"),
          dateEnd: dateEnd.format("YYYY-MM-DD"),
          timeDetailDateStart: dateStart,
          timeDetailDateEnd: dateEnd,
        });
        const payslipDatesByDatesInMonth = datesInMonth.map((dateInMonth) => {
          const newPayslipShifts = generatePayslipShifts({
            date: dayjs(dateInMonth.date),
            employee: data.employee,
            schedules: filteredSchedules,
          });

          return {
            date: dateInMonth.date,
            employee: data?.employee,
            attendanceTime: 0,
            attendanceSalary: 0,
            totalTime: newPayslipShifts.reduce(
              (total, newPayslipShift) => total + newPayslipShift.time,
              0,
            ),
            totalSalary: 0,
            status: PayslipStatus.unknown,
            payslipShifts: newPayslipShifts,
          } as PayslipDate;
        });

        if (!payslipDates.length) {
          return {
            month: month.format("YYYY-MM"),
            totalTime: 0,
            totalSalary: 0,
            totalStatus: PayslipStatus.unknown,
            payslipDates: payslipDatesByDatesInMonth,
          } as PayslipMonth;
        }
        const newPayslipDates = payslipDatesByDatesInMonth.map(
          (payslipDateByDatesInMonth) => {
            const date = dayjs(payslipDateByDatesInMonth.date);
            const existsPayslipDate = payslipDates.find((payslipDate) =>
              checkDateEqual({
                date: payslipDate.date,
                timeDetail: date,
                format: "YYYY-MM-DD",
              }),
            );

            if (!existsPayslipDate) return payslipDateByDatesInMonth;
            return {
              ...existsPayslipDate,
              date: date.format("YYYY-MM-DD"),
            } as PayslipDate;
          },
        );

        return {
          month: month.format("YYYY-MM"),
          ...calPayslipMonth({ payslipDates: newPayslipDates }),
          payslipDates: newPayslipDates,
        } as PayslipMonth;
      } else if (timeline === "month") {
        const date = dayjs((td as { date: string })?.date);
        const payslipDate = filteredSalaryDatas?.find((filteredSalaryData) =>
          checkDateEqual({
            date: filteredSalaryData.date,
            timeDetail: date,
            format: "YYYY-MM-DD",
          }),
        );

        if (!payslipDate) {
          const newPayslipShifts = generatePayslipShifts({
            date: date,
            employee: data.employee,
            schedules: filteredSchedules,
          });

          return {
            date: date.format("YYYY-MM-DD"),
            employee: data?.employee,
            attendanceTime: 0,
            attendanceSalary: 0,
            totalTime: newPayslipShifts.reduce(
              (total, payslipShift) => total + payslipShift.time,
              0,
            ),
            totalSalary: 0,
            status: PayslipStatus.unknown,
            payslipShifts: newPayslipShifts,
          } as PayslipDate;
        }

        return payslipDate;
      }
    });

    return salaryAttendanceDataFinal;
  }, [
    timeDetailDateStartValue,
    timeDetailDateEndValue,
    timelineData,
    filteredSalaryDatas,
  ]);

  return (
    <>
      <div className="left-info">
        <ProfileCard data={data} />
      </div>
      <div className="main-detail">
        <FilterCard
          objectEN="payslip-ticket"
          timeline={timeline}
          setTimeline={setTimeline}
          timeDetail={timeDetail}
          setTimeDetail={setTimeDetail}
        />
        {/* <BenefitCard /> */}
        <RoleHistoryCard
          data={{ filteredRoleHistories: filteredRoleHistories }}
        />
        <AttendanceCard
          timeline={timeline}
          timeDetail={timeDetail}
          timeDetailDateStart={timeDetailDateStartValue}
          timeDetailDateEnd={timeDetailDateEndValue}
          data={{ salaryAttendanceData: salaryAttendanceData }}
        />
        {/* <PermissionTicketCard
          data={{ filteredPermissionTickets: filteredPermissionTickets }}
        /> */}
        <RewardPunishCard
          data={{ filteredRewardPunishes: filteredRewardPunishes }}
        />
        <SummaryCard
          data={{
            filteredSalaryDatas: filteredSalaryDatas,
            filteredRewardPunishes: filteredRewardPunishes,
          }}
        />
      </div>
    </>
  );
};

export default ManagerHandlePayslip;
