import { useState, type FC } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ScheduleType, ShiftType } from "../../../common/types";
import { openNotification } from "../../../utils/show-notification";
import dayjs from "dayjs";

// Timetable Item
export interface TimetableItem {
  scheduleId: number;
  shiftId: number;
  shiftName: string;
  dayOfWeek: number;
  timeStart: string;
  timeEnd: string;
  shiftOrder: number;
  scheduleOrder: number;
}
// View Mode
type ViewMode = "date" | "week" | "month";

// Custom Timetable Props
interface CustomTimetableProps {
  viewMode?: ViewMode;
  isSchedule?: boolean;
  isCrud?: boolean;
  isShowHeader?: boolean;
  isShowToday?: boolean;
  isUseScheduleOrder?: boolean;
  //   shifts?: ShiftType[];
  schedules?: ScheduleType[];
  cells?: Set<string>;
  setCells?: (cells: Set<string>) => void;
}

// Custom Timetable
const CustomTimetable: FC<CustomTimetableProps> = ({
  viewMode: initViewMode = "date",
  isSchedule = false,
  isCrud = false,
  isShowHeader = false,
  isShowToday = true,
  isUseScheduleOrder = false,
  //   shifts = [],
  schedules = [],
  cells,
  setCells,
}) => {
  // View Mode
  const [viewMode, setViewMode] = useState<ViewMode>(initViewMode);
  // Danh sách các ngày
  const days: { label: string; value: 1 | 2 | 3 | 4 | 5 | 6 | 7 }[] = [
    { label: "Thứ 2", value: 1 },
    { label: "Thứ 3", value: 2 },
    { label: "Thứ 4", value: 3 },
    { label: "Thứ 5", value: 4 },
    { label: "Thứ 6", value: 5 },
    { label: "Thứ 7", value: 6 },
    { label: "Chủ nhật", value: 7 },
  ];
  // Danh sách các giờ
  const hours = Array.from({ length: 24 }, (_, i) => i); // 00 -> 24

  // Các biến và hàm sử dụng cho Ngày
  // - Date offset
  const [dateOffset, setDateOffset] = useState(new Date());

  // Các biến và hàm sử dụng cho Tuần
  // - Week offset
  // + 0 = tuần hiện tại
  // + -1 = tuần trước
  // + +1 = tuần sau
  const [weekOffset, setWeekOffset] = useState(0);
  // - Hàm lấy thông tin tuần
  const getWeekInfo = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay() || 7; // CN = 7
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + offset * 7);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const format = (d: Date) =>
      d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    return {
      start: monday,
      end: sunday,
      label: `${format(monday)} - ${format(sunday)}`,
    };
  };
  // - Thông tin tuần
  const weekInfo = getWeekInfo(weekOffset);

  // Các biến và hàm sử dụng cho Tháng
  // - Month offset
  // + 0 = tuần hiện tại
  // + -1 = tuần trước
  // + +1 = tuần sau
  const [monthOffset, setMonthOffset] = useState(0);
  // - Hàm lấy thông tin tháng
  const getMonthInfo = (offset: number) => {
    const base = new Date();
    const date = new Date(base.getFullYear(), base.getMonth() + offset, 1);

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      label: date.toLocaleDateString("vi-VN", {
        month: "long",
        year: "numeric",
      }),
    };
  };
  // - Thông tin tháng
  const monthInfo = getMonthInfo(monthOffset);
  // - Hàm vẽ bảng tháng
  const buildMonthGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay() || 7;

    const lastDay = new Date(year, month + 1, 0).getDate();

    const grid: (Date | null)[] = [];

    for (let i = 1; i < startDay; i++) grid.push(null);

    for (let d = 1; d <= lastDay; d++) {
      grid.push(new Date(year, month, d));
    }

    while (grid.length % 7 !== 0) grid.push(null);

    return grid;
  };
  // - Biến giữ giá trị bảng tháng
  const monthGrid = buildMonthGrid(monthInfo.year, monthInfo.month);

  // Hàm và biến sử dụng để xác định Ngày hiện tại
  const today = new Date();
  const isSameDate = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  // Các biến và hàm sử dụng cho Ca làm
  // - Key của 1 ô
  const cellKey = (day: number, hour: number) => `${day}-${hour}`;
  // - Hàm nhấn vào 1 ô
  const toggleCell = (day: number, hour: number) => {
    const key = cellKey(day, hour);
    const next = new Set(cells);

    next.has(key) ? next.delete(key) : next.add(key);
    setCells!(next); // 🔥 đẩy ra ngoài
  };

  // Các biến và hàm sử dụng cho Lịch làm
  //
  const timeToHour = (time: string) => Number(time.split(":")[0]);
  //
  const flattenShifts = (schedules: ScheduleType[]): TimetableItem[] => {
    // - Tạo thành 1 mảng duy nhất
    let totalShiftOrder = 0;
    const shiftsMap = schedules.flatMap(
      (schedule, scheduleIndex) =>
        schedule.scheduleShifts?.flatMap((scheduleShift) => {
          totalShiftOrder += 1;

          return (
            scheduleShift.shift?.shiftDetails?.map((scheduleDetail) => ({
              scheduleId: schedule.id!,
              scheduleDateStart: schedule.dateStart,
              scheduleDateEnd: schedule.dateEnd,
              shiftId: scheduleShift.shift!.id!,
              shiftName: scheduleShift.shift!.name || "Ca làm",
              dayOfWeek: scheduleDetail.dayOfWeek!,
              timeStart: scheduleDetail.timeStart!,
              timeEnd: scheduleDetail.timeEnd!,
              shiftOrder: totalShiftOrder,
              scheduleOrder: scheduleIndex + 1,
            })) || []
          );
        }) || [],
    );

    // - Kiểm tra trùng thì thông báo lỗi và trả về mảng rỗng
    let isA = false;
    for (let i = 0; i < shiftsMap.length - 1; i++) {
      for (let j = 0; j < shiftsMap.length; j++) {
        if (
          shiftsMap[i].shiftId !== shiftsMap[j].shiftId &&
          shiftsMap[i].dayOfWeek === shiftsMap[j].dayOfWeek &&
          dayjs(shiftsMap[i].scheduleDateStart).isSameOrBefore(
            dayjs(shiftsMap[j].scheduleDateEnd),
          ) &&
          dayjs(shiftsMap[j].scheduleDateStart).isSameOrBefore(
            dayjs(shiftsMap[i].scheduleDateEnd),
          ) &&
          ((timeToHour(shiftsMap[i].timeStart) >=
            timeToHour(shiftsMap[j].timeStart) &&
            timeToHour(shiftsMap[i].timeStart) <
              timeToHour(shiftsMap[j].timeEnd)) ||
            (timeToHour(shiftsMap[i].timeEnd) >
              timeToHour(shiftsMap[j].timeStart) &&
              timeToHour(shiftsMap[i].timeEnd) <=
                timeToHour(shiftsMap[j].timeEnd)))
        ) {
          isA = true;
          break;
        }
      }
    }
    if (isA) {
      openNotification({
        type: "warning",
        message: "Cảnh báo!",
        description: "Có ít nhất 2 ca làm trùng giờ. Không thể tạo lịch làm!",
      });

      return [];
    }

    return shiftsMap;
  };
  //
  const items = flattenShifts(schedules);
  //
  const isItemValidForDate = (item: TimetableItem, date: Date) => {
    if (isCrud) return true;

    const schedule = schedules.find(
      (schedule) => schedule.id === item.scheduleId,
    );
    if (!schedule?.dateStart || !schedule?.dateEnd) return true;

    const start = new Date(schedule.dateStart);
    const end = new Date(schedule.dateEnd);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return date >= start && date <= end;
  };
  //
  const findShiftAt = (date: Date, hour: number) => {
    const dow = date.getDay() || 7;

    return items.find((item) => {
      if (item.dayOfWeek !== dow) return false;

      const start = timeToHour(item.timeStart);
      const end = timeToHour(item.timeEnd);

      return hour >= start && hour < end && isItemValidForDate(item, date);
    });
  };
  //
  const getShiftsByDate = (date: Date): TimetableItem[] => {
    const dow = date.getDay() || 7;

    return items.filter(
      (item) => item.dayOfWeek === dow && isItemValidForDate(item, date),
    );
  };

  return (
    <>
      {isShowHeader && isSchedule && (
        <div className="timetable-header">
          <div className="buttons prev-next">
            <button
              onClick={() => {
                if (viewMode === "date") {
                  const d = new Date(dateOffset);
                  d.setDate(d.getDate() - 1);
                  setDateOffset(d);
                } else if (viewMode == "week") setWeekOffset((p) => p - 1);
                else if (viewMode === "month") setMonthOffset((p) => p - 1);
              }}
            >
              <ArrowLeft />
            </button>
            <button
              onClick={() => {
                if (viewMode === "date") {
                  const d = new Date(dateOffset);
                  d.setDate(d.getDate() + 1);
                  setDateOffset(d);
                } else if (viewMode == "week") setWeekOffset((p) => p + 1);
                else if (viewMode === "month") setMonthOffset((p) => p + 1);
              }}
            >
              <ArrowRight />
            </button>
            <button
              className="current"
              onClick={() => {
                setDateOffset(new Date());
                setWeekOffset(0);
                setMonthOffset(0);
              }}
            >
              Hiện tại
            </button>
          </div>
          <h3>
            {viewMode === "date"
              ? dateOffset.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : viewMode === "week"
                ? weekInfo.label
                : monthInfo.label}
          </h3>
          <div className="buttons view-switch">
            <button
              className={viewMode === "date" ? "active" : ""}
              onClick={() => {
                setViewMode("date");
                setDateOffset(new Date());
              }}
            >
              Ngày
            </button>
            <button
              className={viewMode === "week" ? "active" : ""}
              onClick={() => setViewMode("week")}
            >
              Tuần
            </button>
            <button
              className={viewMode === "month" ? "active" : ""}
              onClick={() => setViewMode("month")}
            >
              Tháng
            </button>
          </div>
        </div>
      )}
      {viewMode === "date" && (
        <table className="timetable date">
          <thead>
            <tr>
              <th>Giờ</th>
              <th>
                {dateOffset.toLocaleDateString("vi-VN", {
                  weekday: "long",
                })}
              </th>
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => {
              const isToday = isSameDate(dateOffset, today);

              const shift = findShiftAt(dateOffset, hour);

              // Không có ca
              if (!shift) {
                return (
                  <tr key={hour}>
                    <td>{hour.toString().padStart(2, "0")}:00</td>
                    <td className={isShowToday && isToday ? "today" : ""}></td>
                  </tr>
                );
              }

              const startHour = timeToHour(shift.timeStart);
              const isStart = hour === startHour;

              // Giờ nằm GIỮA ca → vẫn render tr, nhưng KHÔNG có td ca
              if (!isStart) {
                return (
                  <tr key={hour}>
                    <td>{hour.toString().padStart(2, "0")}:00</td>
                  </tr>
                );
              }

              // Giờ bắt đầu ca
              const span =
                timeToHour(shift.timeEnd) - timeToHour(shift.timeStart);

              return (
                <tr key={hour}>
                  <td>{hour.toString().padStart(2, "0")}:00</td>
                  <td rowSpan={span} className="shift-cell">
                    <div
                      className="shift-block"
                      data-shift={
                        isUseScheduleOrder
                          ? shift.scheduleOrder
                          : shift.shiftOrder
                      }
                    >
                      <strong>{shift.shiftName}</strong>
                      <div>
                        {shift.timeStart} - {shift.timeEnd}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {viewMode === "week" && (
        <table className={"timetable week " + (!isSchedule ? "crud" : "")}>
          <thead>
            <tr>
              <th>Giờ / Thứ</th>
              {days.map((day) => (
                <th key={day.value}>{day.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isSchedule ? (
              <>
                {hours.map((hour) => (
                  <tr key={hour}>
                    <td>
                      {hour.toString().padStart(2, "0")}:00 -{" "}
                      {(hour + 1).toString().padStart(2, "0")}:00
                    </td>
                    {days.map((day) => {
                      const dateOfDay = new Date(weekInfo.start);
                      dateOfDay.setDate(
                        weekInfo.start.getDate() + day.value - 1,
                      );

                      const isToday = isSameDate(dateOfDay, today);

                      const shift = findShiftAt(dateOfDay, hour);

                      // nếu đang ở giữa ca → bỏ qua (rowSpan xử lý)
                      if (shift) {
                        const startHour = timeToHour(shift?.timeStart);
                        if (hour !== startHour) return null;

                        const span =
                          timeToHour(shift?.timeEnd) -
                          timeToHour(shift?.timeStart);

                        return (
                          <td
                            key={`${day.value}-${hour}`}
                            rowSpan={span}
                            className="shift-cell"
                          >
                            <div
                              className="shift-block"
                              data-shift={
                                isUseScheduleOrder
                                  ? shift.scheduleOrder
                                  : shift.shiftOrder
                              }
                            >
                              <h3>{shift?.shiftName}</h3>
                              {isCrud && (
                                <p>
                                  <span>Mã: </span>
                                  <b>#{shift?.shiftId}</b>
                                </p>
                              )}
                              <p className="time">
                                {shift?.timeStart} - {shift?.timeEnd}
                              </p>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={`${day.value}-${hour}`}
                          className={isShowToday && isToday ? "today" : ""}
                        />
                      );
                    })}
                  </tr>
                ))}
              </>
            ) : (
              <>
                {hours.map((hour) => (
                  <tr key={hour}>
                    <td>
                      {hour > 9 ? hour : "0" + hour}:00 -{" "}
                      {hour + 1 > 9 ? hour + 1 : "0" + (hour + 1)}
                      :00
                    </td>
                    {days.map((day) => {
                      const key = cellKey(day.value, hour);
                      return (
                        <td
                          key={key}
                          className={cells?.has(key) ? "active" : ""}
                          onClick={() => toggleCell(day.value, hour)}
                        />
                      );
                    })}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      )}
      {viewMode === "month" && (
        <table className="timetable month">
          <thead>
            <tr>
              <th>Tuần / Thứ</th>
              {days.map((d) => (
                <th key={d.value}>{d.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: monthGrid.length / 7 }).map((_, row) => (
              <tr key={row}>
                <td>Tuần {row + 1}</td>
                {monthGrid.slice(row * 7, row * 7 + 7).map((date, col) => {
                  if (!date) return <td key={col} />;

                  const isToday = isSameDate(date, today);

                  const shifts = getShiftsByDate(date);

                  return (
                    <td
                      key={col}
                      className={`shift-cell ${isShowToday && isToday ? "today" : ""}`}
                    >
                      <p className="date">{date.getDate()}</p>
                      {shifts.map((shift) => (
                        <p
                          key={shift.shiftId}
                          className="shift-dot"
                          data-shift={
                            isUseScheduleOrder
                              ? shift.scheduleOrder
                              : shift.shiftOrder
                          }
                        >
                          {/* <span className="dot"></span> */}
                          {/* <b>{shift.shiftName}:</b> */}
                          <span>
                            {shift.timeStart} - {shift.timeEnd}
                          </span>
                        </p>
                      ))}

                      {/* {shifts.length > 1 && (
                        <a className="more">+{shifts.length - 1} ca</a>
                      )} */}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CustomTimetable;
