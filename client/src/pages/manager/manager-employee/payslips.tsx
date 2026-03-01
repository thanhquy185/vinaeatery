import { useMemo, useState, type FC } from "react";
import { Button, Image, InputNumber } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DollarSign, IdCard, Settings } from "lucide-react";
import type { ManagerPageProps } from "../../../common/props";
import {
  AttendanceStatus,
  CategoryRewardPunishHandle,
  CommonStatus,
  EmployeeStatus,
  ImageSourcePath,
  RewardPunishStatus,
} from "../../../common/values";
import type {
  AttendanceType,
  EmployeeType,
  PayslipAttendanceDate,
  PayslipDate,
  PayslipShiftType,
  PayslipType,
  PermissionTicketType,
  RewardPunishType,
  ScheduleType,
} from "../../../common/types";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import ManagerHandlePayslip from "../../../components/admin-manager/modal/payslip/manager-handle-payslip";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllAttendance } from "../../../requests/attendances";
import { FindAllSchedule } from "../../../requests/schedule";
import { FindAllPermissionTicket } from "../../../requests/permission-tickets";
import { FindAllRewardPunish } from "../../../requests/reward-punishes";
import { FindAllEmployee } from "../../../requests/employees";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import {
  calPayslipAttendanceSalary,
  calPayslipAttendanceTime,
  calPayslipDate,
  calPayslipStatus,
  generatePayslipShifts,
} from "../../../utils/payslip-events";
import dayjs from "dayjs";
import { vietnamMoneyFormat } from "../../../utils/other-events";

// Manager Payslips Page
const ManagerPayslipsPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Có là chủ nhà hàng đăng nhập
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  // + Nhân viên
  const { data: employees } = useEntityQuery<EmployeeType[]>({
    keys: ["employees", restaurantIdForCrud, EmployeeStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [EmployeeStatus.active],
    },
    api: FindAllEmployee,
  });
  // + Lịch làm
  const { data: schedules } = useEntityQuery<ScheduleType[]>({
    keys: ["schedules", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllSchedule,
  });
  // + Chấm công
  const { data: attendances } = useEntityQuery<AttendanceType[]>({
    keys: ["attendances", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllAttendance,
  });
  // + Đơn xin phép
  const { data: permissionTickets } = useEntityQuery<PermissionTicketType[]>({
    keys: ["permissionTickets", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllPermissionTicket,
  });
  // + Thưởng - Phạt
  const { data: rewardPunishes } = useEntityQuery<RewardPunishType[]>({
    keys: ["rewardPunishes", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllRewardPunish,
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
        const totalSalary = salaryDatas
          ?.filter((salaryData) => salaryData.employee.id === employee.id)
          ?.reduce(
            (total, salaryData) => total + salaryData.attendanceSalary,
            0,
          );
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
                totalPunish += rewardPunish.money || 0;
              }
            }
          });
        const summary = totalSalary + totalReward - totalPunish;
        const settlement = 0;

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
          permissionTickets: permissionTickets?.filter(
            (permissionTicket) =>
              permissionTicket.employeeMain?.id === employee.id,
          ),
          rewardPunishes: rewardPunishes?.filter(
            (rewardPunish) => rewardPunish.employeeMain?.id === employee.id,
          ),
          salaryDatas: salaryDatas?.filter(
            (salary) => salary.employee?.id === employee.id,
          ),
          totalSalary: totalSalary,
          totalReward: totalReward,
          totalPunish: totalPunish,
          summary: summary,
          settlement: settlement,
        };
      }) || []
    );
  }, [employees, schedules, attendances, permissionTickets, rewardPunishes]);
  // - Cột thuộc tính
  const columns: ColumnsType<any> = [
    {
      title: "Nhân viên",
      dataIndex: "employee",
      key: "employee",
      width: "20%",
      render: (employee: EmployeeType) => (
        <div className="employee-info">
          <Image
            src={
              employee.image
                ? (employee.image as string)
                : ImageSourcePath + "no-image.png"
            }
          />
          <div>
            <p className="name">{employee.fullname}</p>
            <p className="has-icon">
              <IdCard />
              <span>{employee.id}</span>
            </p>
            <p className="has-icon">
              <Settings />
              <span>{employee.currentRole?.name}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Tiền lương",
      dataIndex: "totalSalary",
      key: "totalSalary",
      width: "12%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
            {/* <Button
              size="small"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Đặt lại
            </Button> */}
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const totalSalary = record.totalSalary ?? 0;
        if (min && totalSalary < min) return false;
        if (max && totalSalary > max) return false;
        return true;
      },
      sorter: (a, b) => a?.totalSalary! - b?.totalSalary!,
      render: (totalSalary: number) => vietnamMoneyFormat(totalSalary || 0),
    },
    {
      title: "Tiền thưởng",
      dataIndex: "totalReward",
      key: "totalReward",
      width: "12%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
            {/* <Button
              size="small"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Đặt lại
            </Button> */}
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const totalReward = record.totalReward ?? 0;
        if (min && totalReward < min) return false;
        if (max && totalReward > max) return false;
        return true;
      },
      sorter: (a, b) => a?.totalReward! - b?.totalReward!,
      render: (totalReward: number) => vietnamMoneyFormat(totalReward || 0),
    },
    {
      title: "Tiền phạt",
      dataIndex: "totalPunish",
      key: "totalPunish",
      width: "12%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
            {/* <Button
              size="small"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Đặt lại
            </Button> */}
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const totalPunish = record.totalPunish ?? 0;
        if (min && totalPunish < min) return false;
        if (max && totalPunish > max) return false;
        return true;
      },
      sorter: (a, b) => a?.totalPunish! - b?.totalPunish!,
      render: (totalPunish: number) => vietnamMoneyFormat(totalPunish || 0),
    },
    {
      title: "Tổng lương nhận",
      dataIndex: "summary",
      key: "summary",
      width: "16%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
            {/* <Button
              size="small"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Đặt lại
            </Button> */}
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const summary = record.summary ?? 0;
        if (min && summary < min) return false;
        if (max && summary > max) return false;
        return true;
      },
      sorter: (a, b) => a?.summary! - b?.summary!,
      render: (summary: number) => vietnamMoneyFormat(summary || 0),
    },
    {
      title: "Tổng quyết toán",
      dataIndex: "settlement",
      key: "settlement",
      width: "16%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
            {/* <Button
              size="small"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Đặt lại
            </Button> */}
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const settlement = record.settlement ?? 0;
        if (min && settlement < min) return false;
        if (max && settlement > max) return false;
        return true;
      },
      sorter: (a, b) => a?.settlement! - b?.settlement!,
      render: (settlement: number) => vietnamMoneyFormat(settlement || 0),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "12",
      className: "buttons",
      render: (text: any, record: PayslipType, index: number) => (
        <>
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.detail,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.detail)}
              onClick={() =>
                openModal({
                  title: `${nameVN} nhân viên`,
                  width: "90%",
                  className: `default sticky ${nameEN}`,
                  children: ManagerPayslipModals.handle(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faBars} /> */}
              <DollarSign />
            </button>
          )}
        </>
      ),
    },
  ];

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Họ tên", value: "fullname" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Lọc dữ liệu
  const filteredPayslip = useMemo(() => {
    if (!payslips) return [];

    return payslips.filter((payslip) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(payslip?.employee.id).includes(value);
        }

        if (filterFindType === "fullname") {
          matchFind = payslip?.employee.fullname
            ?.toLowerCase()
            .includes(value)!;
        }
      }

      return matchFind;
    });
  }, [payslips, filterFindType, filterFindValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerPayslipModals = {
    handle: (data: any) => (
      <ManagerHandlePayslip
        objectEN={nameEN}
        data={data}
        closeModal={closeModal}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <AdminManagerMainHeader title={nameVN} />
        <AdminManagerMainFilterInfo
          objectName={nameVN}
          findOptions={findOptions}
          filterFindType={filterFindType}
          filterFindValue={filterFindValue}
          setFilterFindType={setFilterFindType}
          setFilterFindValue={setFilterFindValue}
          isShowFilterStatus={false}
          statusOptions={[]}
          filterStatusValue={undefined}
          setFilterStatusValue={() => {}}
          onClickFilterReset={() => {
            setFilterFindType(findOptions[0].value);
            setFilterFindValue(null);
            setTableKey((prev) => prev + 1);
          }}
          isShowFilterCreate={false}
          onClickFilterCreate={() => {}}
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredPayslip || []}
          // isLoading={isLoading}
          isLoading={false}
        />
      </main>
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

export default ManagerPayslipsPage;
