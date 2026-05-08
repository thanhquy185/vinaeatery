import { useEffect, useMemo, useState } from "react";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { ManagerPageProps } from "../../../common/props";
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
} from "../../../common/types";
import {
  AttendanceStatus,
  CategoryRewardPunishHandle,
  CommonStatus,
  EmployeeStatus,
  RewardPunishStatus,
  SalaryAdvanceStatus,
  UserRoleValue,
} from "../../../common/values";
import CustomCardStatic from "../../../components/admin-manager/common/card-static";
import { CustomBarChart } from "../../../components/admin-manager/common/charts";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterDashboard from "../../../components/admin-manager/common/main-filter-dashboard";
import AdminManagerMainTableDashboard from "../../../components/admin-manager/common/main-table-dashboard";
import { FindAllEmployee } from "../../../requests/employees";
import { FindAllAttendance } from "../../../requests/attendances";
import { FindAllSchedule } from "../../../requests/schedule";
import { FindAllAllowance } from "../../../requests/allowances";
import { FindAllInsurance } from "../../../requests/insurances";
import { FindAllPermissionTicket } from "../../../requests/permission-tickets";
import { FindAllRewardPunish } from "../../../requests/reward-punishes";
import { FindAllSalaryAdvance } from "../../../requests/salary-advances";
import {
  calInsuranceSalaryByMinRoleSalary,
  calPayslipAttendanceSalary,
  calPayslipAttendanceTime,
  calPayslipDate,
  calPayslipStatus,
  generatePayslipShifts,
} from "../../../utils/payslip-events";
import { getFilterTimesForDashboard } from "../../../utils/other-events";
import { openNotification } from "../../../utils/show-notification";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const cardsId = "cards-dashboard-human";
const chartId = "chart-dashboard-human";
const tableDataId = "table-data-dashboard-human";

export const cardsQueryDashboardHuman = `#${cardsId}`;
export const chartQueryDashboardHuman = `div[class*='MuiChartsWrapper-root']:has(#${chartId})`;
export const tableDataQueryDashboardHuman = `#${tableDataId}`;

const columnsWidth = ["20%", "5%", "10%", "10%", "10%", "10%", "10%", "15%"];
const columnsTitle = [
  "Nhân viên",
  "Giờ công",
  "Tiền công",
  "Phụ cấp",
  "Bảo hiểm",
  "Ứng lương",
  "Thưởng / Phạt",
  "Tiền lương",
];
const formats = [
  "employee",
  "",
  "price",
  "price",
  "price",
  "price",
  "price",
  "price",
];

const ManagerDashboardHumanPage = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}: ManagerPageProps) => {
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id"),
  );
  const restaurantId = isManager
    ? selectedRestaurantId
    : infoLogin?.restaurantId;

  const [filterTimelineValue, setFilterTimelineValue] = useState<string | null>(
    null,
  );
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string | null
  >(null);

  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [attendances, setAttendances] = useState<AttendanceType[]>([]);
  const [allowances, setAllowances] = useState<AllowanceType[]>([]);
  const [insurances, setInsurances] = useState<InsuranceType[]>([]);
  const [permissionTickets, setPermissionTickets] = useState<
    PermissionTicketType[]
  >([]);
  const [rewardPunishes, setRewardPunishes] = useState<RewardPunishType[]>([]);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvanceType[]>([]);
  const [loading, setLoading] = useState(false);
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
          });
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

  const dashboardData = useMemo(() => {
    if (!filterTimelineValue || !filterTimeDetailValue) {
      return null;
    }

    const times = getFilterTimesForDashboard(
      filterTimelineValue,
      filterTimeDetailValue,
    );

    if (!times) return null;

    const dateStart = times[0].start;
    const dateEnd = times[times.length - 1].end;

    const currentPayslips = payslips || [];

    const totalEmployees = currentPayslips.length;
    const totalHours = currentPayslips.reduce(
      (total, payslip) =>
        total +
        (payslip.salaryDatas?.reduce(
          (s, d) => s + (d.attendanceTime || 0),
          0,
        ) || 0),
      0,
    );
    const totalSalary = currentPayslips.reduce(
      (total, payslip) => total + (payslip.totalSalary || 0),
      0,
    );
    const totalPermissions = currentPayslips.reduce(
      (total, payslip) => total + (payslip.permissionTickets?.length || 0),
      0,
    );
    const totalAllowance = currentPayslips.reduce(
      (total, payslip) => total + (payslip.totalAllowance || 0),
      0,
    );
    const totalInsurance = currentPayslips.reduce(
      (total, payslip) => total + (payslip.totalInsurance || 0),
      0,
    );
    const totalSalaryAdvance = currentPayslips.reduce(
      (total, payslip) => total + (payslip.totalSalaryAdvance || 0),
      0,
    );
    const totalReward = currentPayslips.reduce(
      (total, payslip) => total + (payslip.totalReward || 0),
      0,
    );
    const totalPunish = currentPayslips.reduce(
      (total, payslip) => total + (payslip.totalPunish || 0),
      0,
    );
    const totalSummary = currentPayslips.reduce(
      (total, payslip) => total + (payslip.summary || 0),
      0,
    );
    const totalAttendances = currentPayslips.reduce(
      (total, payslip) => total + (payslip.salaryDatas?.length || 0),
      0,
    );
    const totalPresent = currentPayslips.reduce(
      (total, payslip) =>
        total +
        (payslip.salaryDatas?.filter((d) => d.status === "present")?.length ||
          0),
      0,
    );
    const attendanceRate =
      totalAttendances === 0
        ? 0
        : Number(((totalPresent / totalAttendances) * 100).toFixed(2));

    // Pie data
    const salarySeries: number[] = [];
    times.forEach((time) => {
      let salaryInTime = 0;

      currentPayslips.forEach((payslip) => {
        payslip.salaryDatas?.forEach((salaryData) => {
          if (
            dayjs(salaryData.date).isBetween(
              dayjs(time.start),
              dayjs(time.end),
              "day",
              "[]",
            )
          ) {
            salaryInTime += salaryData.attendanceSalary || 0;
          }
        });
        payslip.allowances?.forEach((allowance) => {
          if (
            dayjs(allowance.month).isBetween(
              dayjs(time.start),
              dayjs(time.end),
              "month",
              "[]",
            ) &&
            allowance.status === CommonStatus.active
          ) {
            const totalAllowance =
              allowance.allowanceDetails?.reduce(
                (total, allowanceDetail) =>
                  total + (allowanceDetail?.categoryAllowance?.money || 0),
                0,
              ) || 0;

            salaryInTime += totalAllowance;
          }
        });
        payslip.insurances?.forEach((insurance) => {
          if (
            dayjs(insurance.month).isBetween(
              dayjs(time.start),
              dayjs(time.end),
              "month",
              "[]",
            ) &&
            insurance.status === CommonStatus.active
          ) {
            const totalEmployeePercent =
              insurance.insuranceDetails?.reduce(
                (total, insuranceDetail) =>
                  total +
                  (insuranceDetail.categoryInsurance?.employeePercent || 0),
                0,
              ) || 0;

            salaryInTime -=
              ((insurance.insuranceSalary || 0) *
                (1.0 * totalEmployeePercent)) /
              100;
          }
        });
        payslip.salaryAdvances?.forEach((salaryAdvance) => {
          if (
            dayjs(salaryAdvance.date).isBetween(
              dayjs(time.start),
              dayjs(time.end),
              "day",
              "[]",
            ) &&
            salaryAdvance.status === SalaryAdvanceStatus.confirm
          ) {
            salaryInTime -= salaryAdvance.money || 0;
          }
        });
        payslip.rewardPunishes?.forEach((rewardPunish) => {
          if (
            dayjs(rewardPunish.date).isBetween(
              dayjs(time.start),
              dayjs(time.end),
              "day",
              "[]",
            ) &&
            rewardPunish.status === RewardPunishStatus.confirm
          ) {
            const categoryRewardPunishHandle =
              rewardPunish.categoryRewardPunish?.handle;

            if (
              categoryRewardPunishHandle === CategoryRewardPunishHandle.reward
            ) {
              salaryInTime += rewardPunish.money || 0;
            } else if (
              categoryRewardPunishHandle === CategoryRewardPunishHandle.punish
            ) {
              salaryInTime -= rewardPunish.money || 0;
            }
          }
        });
      });

      salarySeries.push(salaryInTime);
    });

    // Table data
    const tbody =
      currentPayslips?.map((payslip) => {
        const employee = payslip.employee;
        const attendanceTime =
          payslip.salaryDatas?.reduce(
            (total, salaryData) => total + (salaryData.attendanceTime || 0),
            0,
          ) || 0;

        return [
          {
            id: employee?.id || "",
            fullname: employee?.fullname || "",
            currentRole: employee?.currentRole!,
            avatar: employee?.image,
          },
          attendanceTime,
          payslip.totalSalary || 0,
          payslip.totalAllowance || 0,
          payslip.totalInsurance || 0,
          payslip.totalSalaryAdvance || 0,
          payslip.totalReward || 0 + payslip.totalPunish || 0,
          payslip.summary || 0,
        ];
      }) || [];

    return {
      card: {
        totalEmployees,
        totalHours,
        totalSalary,
        totalPermissions,
        totalAllowance,
        totalInsurance,
        totalSalaryAdvance,
        totalReward,
        totalPunish,
        attendanceRate,
      },
      chart: {
        bar: {
          xAxis: times.map((_, i) => `T${i + 1}`),
          series: salarySeries,
        },
      },
      table: {
        tbody,
        tfoot: [
          totalHours,
          totalAllowance,
          totalSalary,
          totalInsurance,
          totalSalaryAdvance,
          totalReward + totalPunish,
          totalSummary,
        ],
      },
      dateStart,
      dateEnd,
    };
  }, [filterTimelineValue, filterTimeDetailValue, payslips]);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [
          employeeRes,
          scheduleRes,
          attendanceRes,
          allowanceRes,
          insuranceRes,
          permissionTicketRes,
          rewardPunishRes,
          salaryAdvanceRes,
        ] = await Promise.all([
          FindAllEmployee({
            restaurantId,
            statusValue: [EmployeeStatus.active],
          }),
          FindAllSchedule({
            restaurantId,
            statusValue: [CommonStatus.active],
          }),
          FindAllAttendance({
            restaurantId,
          }),
          FindAllAllowance({
            restaurantId,
            statusValue: [CommonStatus.active],
          }),
          FindAllInsurance({
            restaurantId,
            statusValue: [CommonStatus.active],
          }),
          FindAllPermissionTicket({
            restaurantId,
          }),
          FindAllRewardPunish({
            restaurantId,
          }),
          FindAllSalaryAdvance({
            restaurantId,
          }),
        ]);
        if (employeeRes?.status === 200) {
          setEmployees(employeeRes.data || []);
        }
        if (scheduleRes?.status === 200) {
          setSchedules(scheduleRes.data || []);
        }
        if (attendanceRes?.status === 200) {
          setAttendances(attendanceRes.data || []);
        }
        if (allowanceRes?.status === 200) {
          setAllowances(allowanceRes.data || []);
        }
        if (insuranceRes?.status === 200) {
          setInsurances(insuranceRes.data || []);
        }
        if (permissionTicketRes?.status === 200) {
          setPermissionTickets(permissionTicketRes.data || []);
        }
        if (rewardPunishRes?.status === 200) {
          setRewardPunishes(rewardPunishRes.data || []);
        }
        if (salaryAdvanceRes?.status === 200) {
          setSalaryAdvances(salaryAdvanceRes.data || []);
        }
      } catch {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  return (
    <main className="admin-manager-main">
      <AdminManagerMainHeader title={nameVN} />
      <AdminManagerMainFilterDashboard
        setFilterTimelineValue={setFilterTimelineValue}
        setFilterTimeDetailValue={setFilterTimeDetailValue}
        successLoadData={!loading}
        titleDashboard="THỐNG KÊ NHÂN SỰ"
        titlePrint="TKNHANSU"
        typeDashboard="dashboard-human"
        dateDashboardStart={dashboardData?.dateStart}
        dateDashboardEnd={dashboardData?.dateEnd}
      />
      <div className="admin-manager-main__chart split-2">
        <div id={cardsId} className="admin-manager-main__chart-card">
          <CustomCardStatic
            title="Tổng tiền lương"
            value={dashboardData?.card.totalSalary}
            prefix={<DollarCircleOutlined />}
            separator="."
            className="card-1"
          />
          <CustomCardStatic
            title="Tổng nhân viên"
            value={dashboardData?.card.totalEmployees}
            prefix={<TeamOutlined />}
            className="card-2"
          />
          <CustomCardStatic
            title="Tổng giờ công"
            value={dashboardData?.card.totalHours}
            prefix={<ClockCircleOutlined />}
            className="card-3"
          />
          <CustomCardStatic
            title="Nghỉ phép"
            value={dashboardData?.card.totalPermissions}
            prefix={<CalendarOutlined />}
            className="card-4"
          />
          {/* <CustomCardStatic
            title="Tỉ lệ đi làm"
            value={dashboardData?.card.attendanceRate}
            suffix="%"
            prefix={<CheckCircleOutlined />}
            className="card-5"
          />
          <CustomCardStatic
            title="Thưởng / Phạt"
            value={dashboardData?.card.rewardPunish}
            separator="."
            prefix={<TrophyOutlined />}
            className="card-6"
          /> */}
        </div>
        <div className="split-2">
          <CustomBarChart
            id={chartId}
            xAxisLabelValue="Thời gian"
            xAxisDataValue={dashboardData?.chart.bar.xAxis || []}
            seriesLabelValue="Chi phí lương"
            seriesDataValue={dashboardData?.chart.bar.series || []}
          />
        </div>
      </div>
      <AdminManagerMainTableDashboard
        id={tableDataId}
        className="human"
        columnsWidth={columnsWidth}
        columnsTitle={columnsTitle}
        format={formats}
        tbody={dashboardData?.table.tbody}
        tfoot={dashboardData?.table.tfoot}
      />
    </main>
  );
};

export default ManagerDashboardHumanPage;
