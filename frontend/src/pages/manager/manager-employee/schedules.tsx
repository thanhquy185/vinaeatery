import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Lịch dạng lưới (tháng)
import timeGridPlugin from "@fullcalendar/timegrid"; // Lịch dạng thời gian (tuần/ngày)
import interactionPlugin from "@fullcalendar/interaction"; // Kéo thả, chọn, click
import listPlugin from "@fullcalendar/list"; // Lịch biểu dạng danh sách
import viLocale from "@fullcalendar/core/locales/vi";
import CustomFindSelect from "../../../components/common/find-select";
import type { SelectProps } from "antd";

// Admin Schedulers Page
const AdminSchedulesPage = () => {
  // Các biến giữ giá trị từ việc lọc thông tin
  // - Nhân viên
  const employeeOptions: SelectProps["options"] = [
    {
      label: (
        <div className="hasImageInLabel">
          <img src="https://i.pravatar.cc/48?img=1" alt="avatar" />
          <div>
            <span>#1 - Nhân viên 1 - 1234567890 - nv1@gmail.com</span>
            <span>Chức vụ: Quản lý</span>
            <span className="green">Trạng thái: Còn làm</span>
          </div>
        </div>
      ),
      value: "1",
      title:
        "#1 - Nhân viên 1 - 1234567890 - nv1@gmail.com - Quản lý - Còn làm",
    },
    {
      label: (
        <div className="hasImageInLabel">
          <img src="https://i.pravatar.cc/48?img=1" alt="avatar" />
          <div>
            <span>#2 - Nhân viên 2 - 0987654321 - nv2@gmail.com</span>
            <span>Chức vụ: Nhân viên</span>
            <span className="red">Trạng thái: Dừng làm</span>
          </div>
        </div>
      ),
      value: "2",
      title:
        "#2 - Nhân viên 2 - 0987654321 - nv2@gmail.com - Nhân viên - Dừng làm",
    },
    {
      label: (
        <div className="hasImageInLabel">
          <img src="https://i.pravatar.cc/48?img=1" alt="avatar" />
          <div>
            <span>#3 - Nhân viên 3 - 0987654331 - nv3@gmail.com</span>
            <span>Chức vụ: Nhân viên</span>
            <span className="red">Trạng thái: Dừng làm</span>
          </div>
        </div>
      ),
      value: "3",
      title:
        "#3 - Nhân viên 3 - 0987654331 - nv3@gmail.com - Nhân viên - Dừng làm",
    },
  ];
  const [filterEmployeeValue, setFilterEmployeeValue] = useState<
    string[] | null
  >([]);

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Toán - 10A1",
      start: "2025-06-14T08:00:00",
      end: "2025-06-14T09:30:00",
    },
    {
      id: "2",
      title: "Toán - 10A1",
      start: "2025-06-17T08:00:00",
      end: "2025-06-17T09:30:00",
    },
    {
      id: "3",
      title: "Lý - 12A3",
      start: "2025-06-18T13:00:00",
      end: "2025-06-18T14:30:00",
    },
    {
      id: "4",
      title: "Lý - 12A3",
      start: "2025-06-14T13:00:00",
      end: "2025-06-14T14:30:00",
      extendedProps: {
        attendanceStatus: "present",
      },
    },
    {
      id: "5",
      title: "Lý - 12A3",
      start: "2025-06-14T13:00:00",
      end: "2025-06-14T14:30:00",
      extendedProps: {
        attendanceStatus: "absent",
      },
    },
    {
      id: "6",
      title: "Lý - 12A3",
      start: "2025-06-14T13:00:00",
      end: "2025-06-14T14:30:00",
      extendedProps: {
        attendanceStatus: "absence with permission",
      },
    },
  ]);

  // // Thêm sự kiện khi chọn vùng trống
  // const handleDateSelect = (selectInfo: {
  //   view: { calendar: any };
  //   startStr: any;
  //   endStr: any;
  //   allDay: any;
  // }) => {
  //   const title = prompt("Tên lớp / môn học:");
  //   const calendarApi = selectInfo.view.calendar;
  //   calendarApi.unselect(); // clear selection

  //   if (title) {
  //     const newEvent = {
  //       id: String(new Date().getTime()),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //     };
  //     setEvents([...events, newEvent]);
  //   }
  // };

  // Xoá sự kiện khi click
  const handleEventClick = (clickInfo: {
    event: { title: any; remove: () => void; id: string };
  }) => {
    if (
      window.confirm(`Bạn có chắc muốn xoá lịch "${clickInfo.event.title}"?`)
    ) {
      clickInfo.event.remove();
      setEvents((prev) => prev.filter((evt) => evt.id !== clickInfo.event.id));
    }
  };

  // // Cập nhật vị trí sự kiện sau khi kéo thả
  // const handleEventChange = (changeInfo: {
  //   event: { id: string; start: any; end: any };
  // }) => {
  //   const updated = events.map((evt) =>
  //     evt.id === changeInfo.event.id
  //       ? {
  //           ...evt,
  //           start: changeInfo.event.start,
  //           end: changeInfo.event.end,
  //         }
  //       : evt
  //   );
  //   setEvents(updated);
  // };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">Quản lý nhân sự - Lịch làm việc</h1>
        </div>
        <div className="main__filter">
          <CustomFindSelect
            mode={undefined}
            placeholder="Chọn Nhân Viên (Mã nhân viên - Hình ảnh - Họ và tên - Chức vụ - Trạng thái)"
            optionFilterProp="title"
            maxTagCount="responsive"
            className="main__filter-select full filter-employee"
            options={employeeOptions}
            setFilterSelectValue={setFilterEmployeeValue}
          />
        </div>
        <div className="main__calendar">
          <div className="main__notes">
            <p>
              <span className="green"></span>&nbsp;Công việc đã hoàn thành
            </p>
            <p>
              <span className="yellow"></span>&nbsp;Công việc chưa hoàn thành có
              phép
            </p>
            <p>
              <span className="red"></span>&nbsp;Công việc chưa hoàn thành không
              phép
            </p>
            <p>
              <span className="gray"></span>&nbsp;Công việc đang chờ xác định
            </p>
          </div>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            dayMaxEvents={2} // Số công việc hiển thị trên lịch "Tháng" là 2
            // initialView="timeGridWeek"
            selectable={true}
            // editable={true}
            events={events}
            // select={handleDateSelect}
            eventClick={handleEventClick}
            // eventDrop={handleEventChange}
            // eventResize={handleEventChange}
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
              const status = info.event.extendedProps.attendanceStatus;

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
              if (status === "present") setColorByStatus(green);
              if (status === "absence with permission")
                setColorByStatus(yellow);
              if (status === "absent") setColorByStatus(red);
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
        </div>
      </main>
    </>
  );
};

export default AdminSchedulesPage;
