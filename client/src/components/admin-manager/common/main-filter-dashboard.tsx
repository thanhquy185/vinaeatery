import React, { useEffect, useMemo, useState } from "react";
import { Select } from "antd";
import { Download, Printer } from "lucide-react";
import { ImageSourcePath, ModalWidthValue } from "../../../common/values";
import CustomModal from "../../common/modal";
import {
  lineChartQueryDashboardProfit,
  tableDataQueryDashboardProfit,
} from "../../../pages/manager/dashboard/dashboard-profit";
import {
  cardsQueryDashboardOrders,
  chartQueryDashboardOrders,
  tableDataQueryDashboardOrders,
} from "../../../pages/manager/dashboard/dashboard-orders";
import {
  cardsQueryDashboardInputTickets,
  chartQueryDashboardInputTickets,
  tableDataQueryDashboardInputTickets,
} from "../../../pages/manager/dashboard/dashboard-input-tickets";
import {
  cardsQueryDashboardHuman,
  chartQueryDashboardHuman,
  tableDataQueryDashboardHuman,
} from "../../../pages/manager/dashboard/dashboard-human";
import { useModal } from "../../../hook/use-modal";
import { openNotification } from "../../../utils/show-notification";
import { handlePrintTicket } from "../../../utils/print-ticket";
import dayjs from "dayjs";

// Admin Manager Main Filter Dashboard Props
type AdminManagerMainFilterDashboardProps = {
  setFilterTimelineValue?: (value: string | null) => void;
  setFilterTimeDetailValue?: (value: string | null) => void;
  successLoadData?: boolean;
  titleDashboard?: string;
  typeDashboard?: string;
  dateDashboardStart?: string;
  dateDashboardEnd?: string;
  titlePrint?: string;
};

const filterYear = "Theo năm";
const filterQuarter = "Theo quý";
const filterMonth = "Theo tháng";
const yearStart = 2020;
const yearEnd = 2030;

// Admin Manager Main Filter Dashboard
const AdminManagerMainFilterDashboard: React.FC<
  AdminManagerMainFilterDashboardProps
> = ({
  setFilterTimelineValue,
  setFilterTimeDetailValue,
  successLoadData,
  titleDashboard,
  titlePrint,
  typeDashboard,
  dateDashboardStart,
  dateDashboardEnd,
}) => {
  const [timelineValue, setTimelineValue] = useState<string | null>(null);
  const [timeDetailValue, setTimeDetailValue] = useState<string | null>(null);
  const timeDetailOptions = useMemo(() => {
    if (!timelineValue) return [];

    const options: { label: string; value: string }[] = [];

    for (let year = yearStart; year <= yearEnd; year++) {
      if (timelineValue === filterYear) {
        options.push({ label: `Năm ${year}`, value: `Năm ${year}` });
      }

      if (timelineValue === filterQuarter) {
        for (let q = 1; q <= 4; q++) {
          options.push({
            label: `Quý ${q}/${year}`,
            value: `Quý ${q}/${year}`,
          });
        }
      }

      if (timelineValue === filterMonth) {
        for (let m = 1; m <= 12; m++) {
          options.push({
            label: `Tháng ${m}/${year}`,
            value: `Tháng ${m}/${year}`,
          });
        }
      }
    }

    return options;
  }, [timelineValue]);

  useEffect(() => {
    if (successLoadData) {
      setTimelineValue(filterYear);
      setTimeDetailValue("Năm " + dayjs().format("YYYY"));
    }
  }, [successLoadData]);
  useEffect(() => {
    setTimeDetailValue(null);
  }, [timelineValue]);
  useEffect(() => {
    setFilterTimelineValue?.(timelineValue);
    setFilterTimeDetailValue?.(timeDetailValue);
  }, [timelineValue, timeDetailValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Modal cho việc in phiếu thống kê
  const PrintTicketModal = () => {
    // Ngày hiện tại
    const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
    const dateTime = today.replace("T", "__").slice(0, -5);
    const day = today.slice(8, 10);
    const month = today.slice(5, 7);
    const year = today.slice(0, 4);

    // Biến giữ đối tượng in thông qua css selector
    // - Thống kê Lợi nhuận
    const lineChartDashboardProfit = document.querySelector(
      lineChartQueryDashboardProfit,
    );
    const tableDataDashboardProfit = document.querySelector(
      tableDataQueryDashboardProfit,
    );
    // - Thống kê Đơn món ăn
    const cardsDashboardOrders = document.querySelector(
      cardsQueryDashboardOrders,
    );
    const chartDashboardOrders = document.querySelector(
      chartQueryDashboardOrders,
    );
    const tableDataDashboardOrders = document.querySelector(
      tableDataQueryDashboardOrders,
    );
    // - Thống kê Phiếu nhập
    const cardsDashboardInputTickets = document.querySelector(
      cardsQueryDashboardInputTickets,
    );
    const chartDashboardInputTickets = document.querySelector(
      chartQueryDashboardInputTickets,
    );
    const tableDataDashboardInputTickets = document.querySelector(
      tableDataQueryDashboardInputTickets,
    );
    // - Thông kê Nhân sự
    const cardsDashboardHuman = document.querySelector(
      cardsQueryDashboardHuman,
    );
    const chartDashboardHuman = document.querySelector(
      chartQueryDashboardHuman,
    );
    const tableDataDashboardHuman = document.querySelector(
      tableDataQueryDashboardHuman,
    );

    return (
      <>
        <div id="content-print" className="ticket__content">
          <header className="ticket__header">
            <div className="ticket__contact">
              <p className="name">Nhà hàng VINAEATERY</p>
              <p>273 An Đ. Vương, Phường 2, Quận 5, Hồ Chí Minh 700000</p>
              <p>123456789 - 0987654321</p>
              <p>vinaeatery@gmail.com.vn</p>
            </div>
            <img
              src={ImageSourcePath + "brand-image.png"}
              alt="Logo Web"
              className="ticket__logo"
            />
          </header>
          <div className="ticket__line"></div>
          <main className="ticket__body input_ticket">
            <h1 className="ticket__title">{titleDashboard}</h1>
            <p className="ticket__date">
              Ngày thống kê: {dateDashboardStart} - {dateDashboardEnd}
            </p>
            {titleDashboard === "THỐNG KÊ LỢI NHUẬN" &&
              typeDashboard === "dashboard-profit" &&
              lineChartDashboardProfit &&
              tableDataDashboardProfit && (
                <>
                  <p className="ticket__info">
                    <b>Biểu đồ đường:</b>
                  </p>
                  <div
                    className="ticket__chart"
                    dangerouslySetInnerHTML={{
                      __html: lineChartDashboardProfit?.outerHTML ?? "",
                    }}
                  ></div>
                  <p className="ticket__info">
                    <b>Bảng dữ liệu:</b>
                  </p>
                  <div
                    className="ticket__chart"
                    dangerouslySetInnerHTML={{
                      __html: tableDataDashboardProfit?.outerHTML ?? "",
                    }}
                  ></div>
                </>
              )}
            {titleDashboard === "THỐNG KÊ ĐƠN MÓN ĂN" &&
              typeDashboard === "dashboard-orders" &&
              cardsDashboardOrders &&
              chartDashboardOrders &&
              tableDataDashboardOrders && (
                <>
                  <p className="ticket__info">
                    <b>Tóm tắt:</b>
                  </p>
                  <div
                    className="ticket__chart split-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        (cardsDashboardOrders?.outerHTML ?? "") +
                        (chartDashboardOrders?.outerHTML ?? ""),
                    }}
                  ></div>
                  <p className="ticket__info">
                    <b>Bảng dữ liệu:</b>
                  </p>
                  <div
                    className="ticket__chart"
                    dangerouslySetInnerHTML={{
                      __html: tableDataDashboardOrders?.outerHTML ?? "",
                    }}
                  ></div>
                </>
              )}
            {titleDashboard === "THỐNG KÊ PHIẾU NHẬP" &&
              typeDashboard === "dashboard-input-tickets" &&
              cardsDashboardInputTickets &&
              chartDashboardInputTickets &&
              tableDataDashboardInputTickets && (
                <>
                  <p className="ticket__info">
                    <b>Tóm tắt:</b>
                  </p>
                  <div
                    className="ticket__chart split-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        (cardsDashboardInputTickets?.outerHTML ?? "") +
                        (chartDashboardInputTickets?.outerHTML ?? ""),
                    }}
                  ></div>
                  <p className="ticket__info">
                    <b>Bảng dữ liệu:</b>
                  </p>
                  <div
                    className="ticket__chart"
                    dangerouslySetInnerHTML={{
                      __html: tableDataDashboardInputTickets?.outerHTML ?? "",
                    }}
                  ></div>
                </>
              )}
            {titleDashboard === "THỐNG KÊ NHÂN SỰ" &&
              typeDashboard === "dashboard-human" &&
              cardsDashboardHuman &&
              chartDashboardHuman &&
              tableDataDashboardHuman && (
                <>
                  <p className="ticket__info">
                    <b>Tóm tắt:</b>
                  </p>
                  <div
                    className="ticket__chart split-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        (cardsDashboardHuman?.outerHTML ?? "") +
                        (chartDashboardHuman?.outerHTML ?? ""),
                    }}
                  ></div>
                  <p className="ticket__info">
                    <b>Bảng dữ liệu:</b>
                  </p>
                  <div
                    className="ticket__chart"
                    dangerouslySetInnerHTML={{
                      __html: tableDataDashboardHuman?.outerHTML ?? "",
                    }}
                  ></div>
                </>
              )}
          </main>
          <footer className="ticket__footer input_ticket">
            <p className="ticket__customer">
              Ngày {day} tháng {month} năm {year}
              <b>Nhân viên lập phiếu</b>
              (Ký tên, ghi rõ họ tên)
            </p>
            <p className="ticket__customer">
              Ngày {day} tháng {month} năm {year}
              <b>Giám đốc</b>
              (Ký tên, ghi rõ họ tên)
            </p>
          </footer>
        </div>
        <button
          id="print-ticket-button"
          className="ticket__print-btn"
          onClick={() => {
            handlePrintTicket({
              contentPrint: "content-print",
              dateTime: dateTime,
              title: titlePrint,
            });
          }}
        >
          <Download />
          &nbsp;&nbsp;<span>Tải xuống phiếu</span>
        </button>
      </>
    );
  };

  return (
    <>
      <div className="admin-manager-main__filter">
        <Select
          allowClear
          options={[
            { label: filterYear, value: filterYear },
            { label: filterQuarter, value: filterQuarter },
            { label: filterMonth, value: filterMonth },
          ]}
          placeholder="Chọn Mốc thời gian"
          value={timelineValue}
          onChange={(value) => setTimelineValue(value)}
          className="filter-select dashboard"
        />
        <Select
          allowClear
          options={timeDetailOptions}
          placeholder="Chọn Thời gian cụ thể"
          value={timeDetailValue}
          onChange={(value) => setTimeDetailValue(value)}
          className="filter-select dashboard"
          disabled={!timelineValue}
        />
        <button
          className="filter-print btn print"
          onClick={(e) => {
            // Thêm class 'active' thể hiện là nút đang được nhấn
            e.currentTarget.classList.add("active");

            if (
              timelineValue! &&
              timeDetailValue! &&
              timelineValue![0] &&
              timeDetailValue![0]
            ) {
              // handleOnClick!({ timeline: timelineValue![0], timeDetail: timeDetailValue![0] });
              openModal({
                title: "In phiếu thống kê",
                width: ModalWidthValue.active,
                className: "print dashboard-profit",
                children: <PrintTicketModal />,
              });
            } else {
              openNotification({
                type: "error",
                message: "Thất bại",
                description: React.Children.toArray([
                  <p>In phiếu thống kê thất bại !</p>,
                  !timelineValue?.[0] && <p> - Cần chọn Mốc thời gian</p>,
                  !timeDetailValue?.[0] && <p> - Cần chọn Thời gian cụ thể</p>,
                ]),
              });
            }

            // Xoá class 'active' thể hiện là nút không còn được nhấn
            e.currentTarget.classList.remove("active");
          }}
        >
          <Printer />
          <span>In phiếu thống kê</span>
        </button>
      </div>
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

export default AdminManagerMainFilterDashboard;
