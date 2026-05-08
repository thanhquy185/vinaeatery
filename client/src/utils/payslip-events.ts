import type {
  EmployeeType,
  InsuranceType,
  PayslipAttendanceDate,
  PayslipDate,
  PayslipShiftType,
  RoleHistoryType,
  RoleType,
  ScheduleType,
} from "../common/types";
import {
  AttendanceStatus,
  PayslipStatus,
  RoleSalaryType,
} from "../common/values";
import dayjs, { Dayjs } from "dayjs";

// -
export const checkDateEqual = ({
  date,
  timeDetail,
  format,
}: {
  date: string;
  timeDetail: Dayjs;
  format: string;
}) => {
  return dayjs(date).format(format) === dayjs(timeDetail).format(format);
};
export const checkDateStartEndEqual = ({
  dateStart,
  dateEnd,
  timeDetail,
  format,
}: {
  dateStart: string;
  dateEnd: string;
  timeDetail: Dayjs;
  format: string;
}) => {
  return (
    (dayjs(dateStart).format(format) === dayjs(timeDetail).format(format) &&
      dayjs(dateEnd).format(format) === dayjs(timeDetail).format(format)) ||
    (dayjs(dateStart).format(format) <= dayjs(timeDetail).format(format) &&
      !dateEnd)
  );
};
// -
export const generateTimelineData = ({
  timeline,
  timeDetail,
}: {
  timeline: "year" | "month";
  timeDetail: string;
}) => {
  // ===== YEAR VIEW → sinh 12 tháng =====
  if (timeline === "year") {
    const year = timeDetail; // "2026"

    return Array.from({ length: 12 }, (_, index) => {
      const month = dayjs(`${year}-01`).add(index, "month").format("YYYY-MM");

      return { month };
    });
  }

  // ===== MONTH VIEW → sinh ngày trong tháng =====
  if (timeline === "month") {
    const start = dayjs(timeDetail); // "2026-02"
    const daysInMonth = start.daysInMonth();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = start.add(index, "day").format("YYYY-MM-DD");

      return { date };
    });
  }

  return [];
};
export const generateTimelineByDateStartEnd = ({
  timeDetailDateStart,
  timeDetailDateEnd,
  dateStart,
  dateEnd,
}: {
  timeDetailDateStart: Dayjs;
  timeDetailDateEnd: Dayjs;
  dateStart: string;
  dateEnd: string;
}) => {
  const start = dayjs(
    dayjs(dateStart).isSameOrAfter(timeDetailDateStart)
      ? dateStart
      : timeDetailDateStart,
  );
  const end = dayjs(
    dayjs(dateEnd).isSameOrBefore(timeDetailDateEnd)
      ? dateEnd
      : timeDetailDateEnd,
  );
  const daysLength = end.diff(start, "day") + 1;

  return Array.from({ length: daysLength }, (_, index) => {
    const date = start.add(index, "day").format("YYYY-MM-DD");

    return { date };
  });
};
// -
export const generatePayslipShifts = ({
  date,
  employee,
  schedules,
}: {
  date: Dayjs;
  employee: EmployeeType;
  schedules: ScheduleType[];
}) => {
  const d = dayjs(date);
  const index = d.day();

  const shifts =
    schedules
      ?.filter((schedule) =>
        schedule.scheduleEmployees?.find(
          (scheduleEmployee) => scheduleEmployee.employeeId === employee.id,
        ),
      )
      ?.flatMap((schedule) => {
        const inDateRange =
          dayjs(date).isSameOrAfter(dayjs(schedule.dateStart)) &&
          dayjs(date).isSameOrBefore(dayjs(schedule.dateEnd));
        if (!inDateRange) return [];

        return schedule.scheduleShifts?.flatMap((scheduleShift) =>
          scheduleShift.shift?.shiftDetails?.some(
            (detail) =>
              detail.dayOfWeek === index ||
              (detail.dayOfWeek === 7 && index === 0),
          )
            ? [scheduleShift.shift]
            : [],
        );
      }) ?? [];
  const payslipShifts =
    shifts.map((shift) => {
      const shiftDetails =
        shift?.shiftDetails?.filter(
          (shiftDetail) =>
            shiftDetail.dayOfWeek === index ||
            (shiftDetail.dayOfWeek === 7 && index === 0),
        ) ?? [];

      return {
        id: shift?.id,
        name: shift?.name,
        time:
          shiftDetails
            ?.map((shiftDetail) =>
              dayjs(shiftDetail?.timeEnd, "HH:mm").diff(
                dayjs(shiftDetail?.timeStart, "HH:mm"),
                "hour",
              ),
            )
            ?.reduce((total, time) => total + time, 0) || 0,
        status: AttendanceStatus.pending,
      } as PayslipShiftType;
    }) || [];

  return payslipShifts;
};
// -
export const calPayslipAttendanceTime = ({
  attendanceDate,
}: {
  attendanceDate: PayslipAttendanceDate;
}) => {
  let attendanceTime = 0;
  attendanceDate.payslipShifts.forEach((payslipShift) => {
    if (payslipShift.status === AttendanceStatus.full)
      return (attendanceTime += payslipShift.time);
    else if (payslipShift.status === AttendanceStatus.half)
      return (attendanceTime += (1.0 * payslipShift.time) / 2);
  });

  return attendanceTime;
};
export const calPayslipAttendanceSalary = ({
  days,
  attendanceTime,
  totalTime,
  roleHistory,
}: {
  days: number;
  attendanceTime: number;
  totalTime: number;
  roleHistory: RoleHistoryType;
}) => {
  const roleSalaryType = roleHistory?.roleSalaryType;
  const roleSalaryValue = roleHistory?.roleSalaryValue;

  let salary = 0;
  if (roleSalaryType === RoleSalaryType.fixed) {
    const salaryOnDay = (1.0 * (roleSalaryValue || 0)) / days;
    salary = (1.0 * salaryOnDay * attendanceTime) / totalTime;
  } else if (roleSalaryType === RoleSalaryType.hours) {
    salary = (roleSalaryValue || 0) * attendanceTime;
  }

  return salary;
};
export const calPayslipStatus = ({
  attendanceDate,
}: {
  attendanceDate: PayslipAttendanceDate;
}) => {
  if (!attendanceDate.payslipShifts.length) return PayslipStatus.unknown;

  const isEveryUnknown = attendanceDate.payslipShifts.every(
    (payslipShift) => payslipShift.status === AttendanceStatus.pending,
  );
  if (isEveryUnknown) return PayslipStatus.unknown;

  const isEveryAbsent = attendanceDate.payslipShifts.every(
    (payslipShift) => payslipShift.status === AttendanceStatus.absent,
  );
  if (isEveryAbsent) return PayslipStatus.absent;

  const isEveryFull = attendanceDate.payslipShifts.every(
    (payslipShift) => payslipShift.status === AttendanceStatus.full,
  );
  if (isEveryFull) return PayslipStatus.full;

  return PayslipStatus.noFull;
};
export const calPayslipDate = ({
  date,
  roleHistory,
  attendanceDate,
}: {
  date: string;
  roleHistory?: RoleHistoryType;
  attendanceDate: PayslipAttendanceDate;
}) => {
  if (!attendanceDate)
    return {
      date: date,
      employee: {},
      attendanceTime: 0,
      attendanceSalary: 0,
      totalTime: 0,
      totalSalary: 0,
      status: PayslipStatus.unknown,
      payslipShifts: [],
    } as PayslipDate;

  const payslipTotalTime = attendanceDate.payslipShifts.reduce(
    (total, payslipShift) => total + payslipShift.time,
    0,
  );
  const payslipAttendanceTime = calPayslipAttendanceTime({
    attendanceDate: attendanceDate,
  });
  const payslipAttendanceSalary = calPayslipAttendanceSalary({
    days:
      dayjs(date).endOf("month").diff(dayjs(date).startOf("month"), "day") + 1,
    attendanceTime: payslipAttendanceTime,
    totalTime: payslipTotalTime,
    roleHistory: roleHistory!,
  });
  const payslipStatus = calPayslipStatus({
    attendanceDate: attendanceDate,
  });

  return {
    date: date,
    employee: attendanceDate.employee,
    attendanceTime: payslipAttendanceTime || 0,
    attendanceSalary: payslipAttendanceSalary || 0,
    totalTime: payslipTotalTime,
    totalSalary: 0,
    status: payslipStatus,
    payslipShifts: attendanceDate.payslipShifts,
  } as PayslipDate;
};
// -
export const calPayslipTotalTime = ({
  payslipDates,
}: {
  payslipDates: PayslipDate[];
}) => {
  return payslipDates?.reduce(
    (total, payslipDate) => total + payslipDate.attendanceTime,
    0,
  );
};
export const calPayslipTotalSalary = ({
  payslipDates,
}: {
  payslipDates: PayslipDate[];
}) => {
  let totalSalary = 0;
  payslipDates?.forEach(
    (payslipDate) => (totalSalary += payslipDate.attendanceSalary || 0),
  );

  return totalSalary;
};
export const calPayslipTotalStatus = ({
  payslipDates,
}: {
  payslipDates: PayslipDate[];
}) => {
  const isEveryUnknown = payslipDates.every(
    (payslipDate) => payslipDate.status === PayslipStatus.unknown,
  );
  if (isEveryUnknown) return PayslipStatus.unknown;

  const isEveryAbsent = payslipDates.every(
    (payslipDate) => payslipDate.status === PayslipStatus.absent,
  );
  if (isEveryAbsent) return PayslipStatus.absent;

  const isEveryFull = payslipDates.every(
    (payslipDate) => payslipDate.status === PayslipStatus.full,
  );
  if (isEveryFull) return PayslipStatus.full;

  return PayslipStatus.noFull;
};
export const calPayslipMonth = ({
  payslipDates,
}: {
  payslipDates: PayslipDate[];
}) => {
  const payslipTotalTime = calPayslipTotalTime({ payslipDates: payslipDates });
  const payslipTotalSalary = calPayslipTotalSalary({
    payslipDates: payslipDates,
  });
  const payslipTotalStatus = calPayslipTotalStatus({
    payslipDates: payslipDates,
  });

  return {
    totalTime: payslipTotalTime || 0,
    totalSalary: payslipTotalSalary || 0,
    totalStatus: payslipTotalStatus,
  };
};

// -
const baseInsuranceSalaryForFixed = 10000000;
const baseInsuranceSalaryForHours = 4000000;

export const calRoleSalary = ({
  insuranceRoleHistory,
  insuranceMonth,
}: {
  insuranceRoleHistory: RoleHistoryType;
  insuranceMonth: string;
}) => {
  if (insuranceRoleHistory.roleSalaryType === RoleSalaryType.fixed)
    return (insuranceRoleHistory.roleSalaryValue || 0) <
      baseInsuranceSalaryForFixed
      ? insuranceRoleHistory.roleSalaryValue
      : baseInsuranceSalaryForFixed;

  // return (
  //   (insuranceRoleHistory.roleSalaryValue || 0) *
  //   dayjs(insuranceMonth).daysInMonth()
  // );

  return baseInsuranceSalaryForHours;
};
export const calInsuranceSalaryByMinRoleSalary = ({
  insurance,
  roleHistories,
}: {
  insurance: InsuranceType;
  roleHistories: RoleHistoryType[];
}) => {
  const insuranceRoleHistories = roleHistories.filter((roleHistory) =>
    checkDateStartEndEqual({
      dateStart: roleHistory.dateStart!,
      dateEnd: roleHistory.dateEnd!,
      timeDetail: dayjs(insurance.month!),
      format: "YYYY-MM",
    }),
  );
  if (insuranceRoleHistories.length === 0) return 0;

  if (insuranceRoleHistories.length === 1) {
    return calRoleSalary({
      insuranceRoleHistory: insuranceRoleHistories[0],
      insuranceMonth: insurance.month!,
    });
  }

  const insuranceRoleSalaries = insuranceRoleHistories.map(
    (insuranceRoleHistory) =>
      calRoleSalary({
        insuranceRoleHistory: insuranceRoleHistory,
        insuranceMonth: insurance.month!,
      }),
  );
  return insuranceRoleSalaries.sort((a, b) => (a || 0) - (b || 0))[0];
};
