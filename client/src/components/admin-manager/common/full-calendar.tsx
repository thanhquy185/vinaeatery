import type { FC } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid/index.js"; // Lịch dạng lưới (tháng)
import timeGridPlugin from "@fullcalendar/timegrid/index.js"; // Lịch dạng thời gian (tuần/ngày)
import interactionPlugin, {
  type EventResizeDoneArg,
} from "@fullcalendar/interaction/index.js"; // Kéo thả, chọn, click
import listPlugin from "@fullcalendar/list/index.js"; // Lịch biểu dạng danh sách
import viLocale from "@fullcalendar/core/locales/vi.js";
import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import { AttendanceStatus } from "../../../common/values";

// Custom Full Calendar Props
type CustomFullCalendarProps = {
  dayMaxEvents?: number;
  selectable?: boolean;
  editable?: boolean;
  events?: EventSourceInput;
  handleSelect?: (arg: DateSelectArg) => void;
  handleEventDrop?: (arg: EventDropArg) => void;
  handleEventResize?: (arg: EventResizeDoneArg) => void;
  handleEventClick?: (arg: EventClickArg) => void;
};

// Custom Full Calendar
const CustomFullCalendar: FC<CustomFullCalendarProps> = ({
  dayMaxEvents = 2,
  selectable,
  editable,
  events,
  handleSelect,
  handleEventClick,
  handleEventDrop,
  handleEventResize,
}) => {
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        dayMaxEvents={dayMaxEvents} // Số công việc hiển thị trên lịch "Tháng" là 2
        // initialView="timeGridWeek"
        selectable={selectable}
        editable={editable}
        events={events}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventDidMount={(info) => {
          // Hàm kiểm tra đối tượng có là phần tử html
          const isHtmlElement = (object: any) => {
            return object instanceof HTMLElement;
          };
          // Hàm gán màu tương ứng với trạng thái của công việc
          const setColorByStatus = (color: string) => {
            if (isHtmlElement(dotInMonth)) {
              dotInMonth.style.borderColor = color;
            }
            if (
              isHtmlElement(blockBackgroundInWeekAndDay) &&
              isHtmlElement(blockBorderInWeekAndDay)
            ) {
              blockBackgroundInWeekAndDay.style.backgroundColor = color;
              blockBorderInWeekAndDay.style.borderColor = color;
            }
            if (isHtmlElement(dotInProcess)) {
              dotInProcess.style.borderColor = color;
            }
          };

          // Trạng thái của công việc trong ngày
          const status = info.event.extendedProps.status;

          // Các màu mặc định
          const gray = "#a1a1ac"; // Công việc chưa xác định
          const green = "#3dc55d"; // Công việc đã hoàn thành
          const yellow = "#f5c011"; // Công việc chưa hoàn thành có phép
          const red = "#f44336"; // Công việc chưa hoàn thành

          // Lấy phần tử chấm tròn trong tháng
          const dotInMonth = info.el.querySelector(".fc-daygrid-event-dot");
          // Lấy phần tử block trong tuần và ngày
          const blockBorderInWeekAndDay = info.el;
          const blockBackgroundInWeekAndDay =
            info.el.querySelector(".fc-event-main");
          // Lấy phần tử chấm tròn trong lịch biểu
          const dotInProcess = info.el.querySelector(".fc-list-event-dot");

          // Gán màu theo trạng thái
          setColorByStatus(gray); // Mặc định công việc chưa xác định gì thì là màu xám
          if (status === AttendanceStatus.checked) setColorByStatus(green);
          if (status === AttendanceStatus.leave) setColorByStatus(yellow);
          if (status === AttendanceStatus.absent) setColorByStatus(red);
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        height="auto"
        slotMinTime="00:00:00"
        slotMaxTime="23:59:59"
        scrollTime="07:00:00"
        locale={viLocale}
      />
    </>
  );
};

export default CustomFullCalendar;
