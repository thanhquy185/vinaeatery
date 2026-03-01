import { useMemo, useState, type FC } from "react";
import { RotateCcw } from "lucide-react";
import { DatePicker } from "antd";
import type { ManagerPageProps } from "../../../common/props";
import type {
  AttendanceTableType,
  AttendanceType,
  EmployeeType,
  ScheduleType,
} from "../../../common/types";
import { AttendanceStatus, CommonStatus } from "../../../common/values";
import ConfigVN from "../../../components/common/config-vn";
import CustomAttendanceTable from "../../../components/admin-manager/common/attendance-table";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllEmployee } from "../../../requests/employees";
import { FindAllSchedule } from "../../../requests/schedule";
import { FindAllAttendanceFormat } from "../../../requests/attendances";
import dayjs, { Dayjs } from "dayjs";

// Manager Attendances Page
const ManagerAttendancesPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các biến giữ dữ liệu
  // - Nhân viên
  const { data: employees } = useEntityQuery<EmployeeType[]>({
    keys: ["employees", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllEmployee,
  });
  // - Lịch làm
  const { data: schedules } = useEntityQuery<ScheduleType[]>({
    keys: ["schedules", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllSchedule,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: attendances,
    isLoading,
    isError,
    error,
  } = useEntityQuery<AttendanceType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllAttendanceFormat,
  });
  // - Format dữ liệu
  const attendanceTables: AttendanceTableType[] = useMemo(() => {
    return (
      employees?.map((employee) => ({
        employee,
        schedules: schedules?.filter((s) =>
          s.scheduleEmployees?.some((se) => se.employeeId === employee.id),
        ),
        attendances: attendances?.filter((a) => a.employeeId === employee.id),
      })) || []
    );
  }, [employees, schedules, attendances]);

  // Các biến giữ giá trị từ việc lọc dữ liệu
  // - Tháng / Năm
  const [filterMonthAndYear, setFilterMonthAndYear] = useState<string | null>(
    null,
  );
  // - Ngày bắt đầu / Ngày kết thúc
  const [filterTimeValue, setFilterTimeValue] = useState<{
    dateStart: string | Dayjs;
    dateEnd: string | Dayjs;
  } | null>(null);

  return (
    <>
      <main className="admin-manager-main">
        <AdminManagerMainHeader title={nameVN} />
        <div className="admin-manager-main__filter">
          <ConfigVN
            children={
              <DatePicker
                picker="month"
                format={(value) => {
                  if (!value) return "";

                  return `Tháng ${value.month() + 1}/${value.year()}`;
                }}
                placeholder="Chọn Tháng / Năm"
                className="filter-select big"
                value={
                  filterMonthAndYear
                    ? dayjs(filterMonthAndYear, "YYYY-MM")
                    : undefined
                }
                onChange={(value) => {
                  setFilterMonthAndYear(value ? value.format("YYYY-MM") : null);
                  setFilterTimeValue(null);
                }}
              />
            }
          />
          <ConfigVN
            children={
              <DatePicker.RangePicker
                picker="date"
                disabledDate={(current) => {
                  if (!filterMonthAndYear || !current) return false;

                  const [year, month] = filterMonthAndYear
                    .split("-")
                    .map(Number);

                  return (
                    current.year() !== year || current.month() !== month - 1 // month của dayjs bắt đầu từ 0
                  );
                }}
                format={(value) =>
                  value
                    ? `${value.date() > 9 ? value.date() : "0" + value.date()}/${
                        value.month() + 1 > 9
                          ? value.month() + 1
                          : "0" + (value.month() + 1)
                      }/${value.year()}`
                    : ""
                }
                value={
                  filterTimeValue
                    ? [
                        dayjs(filterTimeValue.dateStart, "YYYY-MM-DD"),
                        dayjs(filterTimeValue.dateEnd, "YYYY-MM-DD"),
                      ]
                    : undefined
                }
                onChange={(value) =>
                  setFilterTimeValue({
                    dateStart: value ? dayjs(value[0], "YYYY-MM-DD") : "",
                    dateEnd: value ? dayjs(value[1], "YYYY-MM-DD") : "",
                  })
                }
                placeholder={["Chọn Ngày BĐ", "Chọn Ngày KT"]}
                className="filter-select big"
                disabled={!filterMonthAndYear}
              />
            }
          />
          <button
            className="filter-reset btn"
            onClick={() => {
              setFilterMonthAndYear(null);
              setFilterTimeValue(null);
            }}
          >
            <RotateCcw />
            <span>Đặt&nbsp;lại</span>
          </button>
          <div className="notes">
            <p className="note">
              <span className="dot green"></span>
              <span>{AttendanceStatus.full}</span>
            </p>
            <p className="note">
              <span className="dot yellow"></span>
              <span>{AttendanceStatus.half}</span>
            </p>
            <p className="note">
              <span className="dot red"></span>
              <span>{AttendanceStatus.absent}</span>
            </p>
            <p className="note">
              <span className="dot gray"></span>
              <span>{AttendanceStatus.pending}</span>
            </p>
          </div>
        </div>
        <div className="admin-manager-main__data">
          <CustomAttendanceTable
            nameEN={nameEN}
            restaurantId={restaurantIdForCrud}
            dateStart={filterTimeValue?.dateStart as string}
            dateEnd={filterTimeValue?.dateEnd as string}
            attendanceTables={attendanceTables}
          />
        </div>
      </main>
    </>
  );
};

export default ManagerAttendancesPage;
