import { useEffect, useMemo } from "react";
import type {
  AllowanceType,
  AttendanceType,
  EmployeeType,
  InsuranceType,
  PayslipAttendanceDate,
  PayslipDate,
  PayslipShiftType,
  PermissionTicketType,
  RewardPunishType,
  SalaryAdvanceType,
  ScheduleType,
} from "../../../../common/types";
import {
  EmployeeStatus,
  CommonStatus,
  AttendanceStatus,
  RewardPunishStatus,
  CategoryRewardPunishHandle,
  SalaryAdvanceStatus,
} from "../../../../common/values";
import ManagerHandlePayslip from "../payslip/manager-handle-payslip";
import { FindAllAllowance } from "../../../../requests/allowances";
import { FindAllAttendance } from "../../../../requests/attendances";
import { FindAllEmployee } from "../../../../requests/employees";
import { FindAllInsurance } from "../../../../requests/insurances";
import { FindAllPermissionTicket } from "../../../../requests/permission-tickets";
import { FindAllRewardPunish } from "../../../../requests/reward-punishes";
import { FindAllSalaryAdvance } from "../../../../requests/salary-advances";
import { FindAllSchedule } from "../../../../requests/schedule";
import {
  calPayslipDate,
  generatePayslipShifts,
  calPayslipStatus,
  calPayslipAttendanceTime,
  calPayslipAttendanceSalary,
  calInsuranceSalaryByMinRoleSalary,
} from "../../../../utils/payslip-events";
import { useEntityQuery } from "../../../../hook/use-entity-query";
import dayjs from "dayjs";

type ManagerPayslipProps = {
  selectedRestaurant: number;
  employee: EmployeeType;
};

const ManagerPayslip: React.FC<ManagerPayslipProps> = ({
  selectedRestaurant,
  employee,
}) => {
  // - Truy vấn dữ liệu
  // + Nhân viên
  const { data: employees } = useEntityQuery<EmployeeType[]>({
    keys: ["employees", selectedRestaurant, EmployeeStatus.active],
    params: {
      restaurantId: selectedRestaurant,
      statusValue: [EmployeeStatus.active],
    },
    api: FindAllEmployee,
  });
  // + Lịch làm
  const { data: schedules } = useEntityQuery<ScheduleType[]>({
    keys: ["schedules", selectedRestaurant, CommonStatus.active],
    params: {
      restaurantId: selectedRestaurant,
      statusValue: [CommonStatus.active],
    },
    api: FindAllSchedule,
  });
  // + Chấm công
  const { data: attendances } = useEntityQuery<AttendanceType[]>({
    keys: ["attendances", selectedRestaurant],
    params: {
      restaurantId: selectedRestaurant,
    },
    api: FindAllAttendance,
  });
  // + Phụ cấp
  const { data: allowances } = useEntityQuery<AllowanceType[]>({
    keys: ["allowances", selectedRestaurant, CommonStatus.active],
    params: {
      restaurantId: selectedRestaurant,
      statusValue: [CommonStatus.active],
    },
    api: FindAllAllowance,
  });
  // + Bảo hiểm
  const { data: insurances } = useEntityQuery<InsuranceType[]>({
    keys: ["insurances", selectedRestaurant, CommonStatus.active],
    params: {
      restaurantId: selectedRestaurant,
      statusValue: [CommonStatus.active],
    },
    api: FindAllInsurance,
  });
  // + Đơn xin phép
  const { data: permissionTickets } = useEntityQuery<PermissionTicketType[]>({
    keys: ["permission-tickets", selectedRestaurant],
    params: {
      restaurantId: selectedRestaurant,
    },
    api: FindAllPermissionTicket,
  });
  // + Thưởng - Phạt
  const { data: rewardPunishes } = useEntityQuery<RewardPunishType[]>({
    keys: ["reward-punishes", selectedRestaurant],
    params: {
      restaurantId: selectedRestaurant,
    },
    api: FindAllRewardPunish,
  });
  // + Ứng lương
  const { data: salaryAdvances } = useEntityQuery<SalaryAdvanceType[]>({
    keys: ["salary-advances", selectedRestaurant],
    params: {
      restaurantId: selectedRestaurant,
    },
    api: FindAllSalaryAdvance,
  });
  // - Tiền lương
  const salaryDatas = useMemo(() => {
    const attendanceDates =
      attendances?.map((attendance) => {
        const currentDate = attendance.date;
        const currentDayIndex = dayjs(currentDate).day();
        const currentEmployee = employees?.find(
          (employee) => employee.id === attendance.employeeId,
        );

        const currentShifts =
          schedules?.flatMap((schedule) => {
            const inDateRange =
              dayjs(currentDate).isSameOrAfter(dayjs(schedule.dateStart)) &&
              dayjs(currentDate).isSameOrBefore(dayjs(schedule.dateEnd));
            if (!inDateRange) return [];

            return schedule.scheduleShifts?.flatMap((scheduleShift) =>
              scheduleShift.shift?.shiftDetails?.some(
                (detail) =>
                  detail.dayOfWeek === currentDayIndex ||
                  (detail.dayOfWeek === 7 && currentDayIndex === 0),
              )
                ? [scheduleShift.shift]
                : [],
            );
          }) ?? [];
        const payslipShifts = currentShifts.map((shift) => {
          if (attendance.shiftId !== shift?.id) return;

          const shiftDetails =
            shift?.shiftDetails?.filter(
              (shiftDetail) =>
                shiftDetail.dayOfWeek === currentDayIndex ||
                (shiftDetail.dayOfWeek === 7 && currentDayIndex === 0),
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
            status: attendance?.status
              ? attendance?.status
              : AttendanceStatus.pending,
          } as PayslipShiftType;
        });

        return {
          date: currentDate,
          employee: currentEmployee,
          payslipShifts: payslipShifts,
        } as PayslipAttendanceDate;
      }) || [];
    if (!attendanceDates.length) return [];

    let filteredAttendanceDates: PayslipAttendanceDate[] = [];
    attendanceDates.forEach((attendanceDate) => {
      if (!attendanceDate || !attendanceDate.employee) return;

      const existsFilteredAttendanceDates = filteredAttendanceDates.filter(
        (filteredAttendanceDate: PayslipAttendanceDate) =>
          filteredAttendanceDate.date === attendanceDate.date &&
          filteredAttendanceDate.employee.id === attendanceDate.employee.id,
      );
      if (existsFilteredAttendanceDates.length) return;

      const existsAttendanceDates = attendanceDates.filter(
        (filteredAttendanceDate: PayslipAttendanceDate) =>
          filteredAttendanceDate.date === attendanceDate.date &&
          filteredAttendanceDate.employee.id === attendanceDate.employee.id,
      );
      if (existsAttendanceDates.length) {
        const validPayslipShifts = existsAttendanceDates.flatMap(
          (existsAttendanceDate) =>
            existsAttendanceDate.payslipShifts.filter(
              (payslipShift) => payslipShift,
            ),
        );

        filteredAttendanceDates.push({
          date: attendanceDate.date,
          employee: attendanceDate.employee,
          payslipShifts: validPayslipShifts || [],
        } as PayslipAttendanceDate);
      } else {
        filteredAttendanceDates.push(attendanceDate);
      }
    });

    const payslipDates = filteredAttendanceDates?.map((attendanceDate) => {
      const roleHistory = attendanceDate.employee?.roleHistories?.find(
        (roleHistory) =>
          dayjs(attendanceDate.date).isSameOrAfter(
            dayjs(roleHistory.dateStart),
          ) &&
          dayjs(attendanceDate.date).isSameOrBefore(
            dayjs(roleHistory.dateEnd ?? "9999-12-31"),
          ),
      );

      return calPayslipDate({
        date: attendanceDate.date,
        roleHistory: roleHistory,
        attendanceDate: attendanceDate,
      });
    });
    if (!payslipDates.length) return [];

    const handlePayslipDates = payslipDates?.map((payslipDate) => {
      const date = dayjs(payslipDate.date);
      const days = date.endOf("month").diff(date.startOf("month"), "day") + 1;

      const payslipShifts = generatePayslipShifts({
        date: date,
        employee: payslipDate.employee,
        schedules: schedules || [],
      });
      const roleHistory = (
        payslipDate.employee as EmployeeType
      ).roleHistories?.find(
        (roleHistory) =>
          dayjs(date).isSameOrAfter(dayjs(roleHistory.dateStart)) &&
          dayjs(date).isSameOrBefore(
            dayjs(roleHistory.dateEnd ?? "9999-12-31"),
          ),
      );

      const newPayslipShifts = payslipShifts?.map((payslipShift) => {
        const payslipDateShift = payslipDate.payslipShifts.find(
          (payslipDateShift) => payslipDateShift.id === payslipShift.id,
        );

        return {
          ...payslipShift,
          time: payslipDateShift?.time
            ? payslipDateShift?.time
            : payslipShift.time,
          status: payslipDateShift?.status
            ? payslipDateShift?.status
            : payslipShift.status,
        } as PayslipShiftType;
      });
      const newPayslipDate = {
        ...payslipDate,
        date: date.format("YYYY-MM-DD"),
        status: calPayslipStatus({
          attendanceDate: {
            payslipShifts: newPayslipShifts,
          } as PayslipAttendanceDate,
        }),
        totalTime: newPayslipShifts.reduce(
          (total, newPayslipShift) => total + newPayslipShift.time,
          0,
        ),
        payslipShifts: newPayslipShifts,
      };

      return {
        ...newPayslipDate,
        attendanceTime: calPayslipAttendanceTime({
          attendanceDate: newPayslipDate,
        }),
        attendanceSalary: calPayslipAttendanceSalary({
          days: days,
          attendanceTime: newPayslipDate.attendanceTime,
          totalTime: newPayslipDate.totalTime,
          roleHistory: roleHistory!,
        }),
      } as PayslipDate;
    });

    return handlePayslipDates;
  }, [employees, schedules, attendances]);
  // - Bảng lương
  const payslips = useMemo(() => {
    return (
      employees?.map((employee) => {
        const employeeInsurances = insurances?.flatMap((insurance) => {
          const insuranceDetails = insurance.insuranceDetails?.filter(
            (insuranceDetail) => insuranceDetail.employeeId === employee.id,
          );
          if (insuranceDetails?.length == 0) return [];

          const insuranceSalary = calInsuranceSalaryByMinRoleSalary({
            insurance: insurance,
            roleHistories: employee.roleHistories || [],
          });

          return { ...insurance, insuranceSalary, insuranceDetails };
        });

        const totalSalary =
          salaryDatas
            ?.filter((salaryData) => salaryData.employee.id === employee.id)
            ?.reduce(
              (total, salaryData) => total + salaryData.attendanceSalary,
              0,
            ) || 0;
        const totalAllowance =
          allowances
            ?.flatMap((allowance) =>
              allowance.allowanceDetails?.filter(
                (allowanceDetail) => allowanceDetail.employeeId === employee.id,
              ),
            )
            ?.reduce(
              (total, allowanceDetail) =>
                total + (allowanceDetail?.categoryAllowance?.money || 0),
              0,
            ) || 0;
        const totalInsurance =
          employeeInsurances?.reduce((total, employeeInsurance) => {
            const totalEmployeePercent =
              employeeInsurance.insuranceDetails?.reduce(
                (total, employeeInsuranceDetail) =>
                  total +
                  (employeeInsuranceDetail.categoryInsurance?.employeePercent ||
                    0),
                0,
              ) || 0;

            return (
              total -
              ((employeeInsurance.insuranceSalary || 0) *
                (1.0 * totalEmployeePercent)) /
                100
            );
          }, 0) || 0;
        let totalReward = 0,
          totalPunish = 0;
        rewardPunishes
          ?.filter(
            (rewardPunish) => rewardPunish.employeeMain?.id === employee.id,
          )
          ?.forEach((rewardPunish) => {
            if (rewardPunish.status === RewardPunishStatus.confirm) {
              const handle = rewardPunish.categoryRewardPunish?.handle;
              if (handle === CategoryRewardPunishHandle.reward) {
                totalReward += rewardPunish.money || 0;
              } else if (handle === CategoryRewardPunishHandle.punish) {
                totalPunish -= rewardPunish.money || 0;
              }
            }
          }) || 0;
        const totalSalaryAdvance =
          salaryAdvances
            ?.filter(
              (salaryAdvance) =>
                salaryAdvance.employeeMain?.id === employee.id &&
                salaryAdvance.status === SalaryAdvanceStatus.confirm,
            )
            ?.reduce(
              (total, salaryAdvance) => total - (salaryAdvance?.money || 0),
              0,
            ) || 0;
        const summary =
          totalSalary +
          totalAllowance +
          totalInsurance +
          totalReward +
          totalPunish +
          totalSalaryAdvance;

        return {
          employee,
          schedules: schedules?.filter((schedule) =>
            schedule.scheduleEmployees?.some(
              (scheduleEmployee) => scheduleEmployee.employeeId === employee.id,
            ),
          ),
          attendances: attendances?.filter(
            (attendance) => attendance.employeeId === employee.id,
          ),
          allowances: allowances?.flatMap((allowance) => {
            const allowanceDetails = allowance.allowanceDetails?.filter(
              (allowanceDetail) => allowanceDetail.employeeId === employee.id,
            );
            if (allowanceDetails?.length == 0) return [];

            return { ...allowance, allowanceDetails };
          }),
          insurances: employeeInsurances,
          permissionTickets: permissionTickets?.filter(
            (permissionTicket) =>
              permissionTicket.employeeMain?.id === employee.id,
          ),
          rewardPunishes: rewardPunishes?.filter(
            (rewardPunish) => rewardPunish.employeeMain?.id === employee.id,
          ),
          salaryAdvances: salaryAdvances?.filter(
            (salaryAdvance) => salaryAdvance.employeeMain?.id === employee.id,
          ),
          salaryDatas: salaryDatas?.filter(
            (salary) => salary.employee?.id === employee.id,
          ),
          totalSalary: totalSalary,
          totalAllowance: totalAllowance,
          totalInsurance: totalInsurance,
          totalReward: totalReward,
          totalPunish: totalPunish,
          totalSalaryAdvance: totalSalaryAdvance,
          summary: summary,
        };
      }) || []
    );
  }, [employees, schedules, attendances, permissionTickets, rewardPunishes]);

  return (
    <ManagerHandlePayslip
      objectEN=""
      data={payslips?.find((payslip) => payslip.employee.id === employee.id)}
      closeModal={() => {}}
    />
  );
};

export default ManagerPayslip;
