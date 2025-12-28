import React from "react";
import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faPrint } from "@fortawesome/free-solid-svg-icons";
import type { SelectProps } from "antd";
import type { DashboardFilterTimeProps } from "../../common/props";
import CustomFindSelect from "../common/find-select";
import CustomModal from "../common/modal";
import {
  lineChartQueryDashboardProfit,
  tableDataQueryDashboardProfit,
} from "../../pages/manager/dashboard/dashboard-profit";
import { openNotification } from "../../utils/showNotification";
import { handlePrintTicket } from "../../utils/printTicket";
import { cardsQueryDashboardOrders, chartQueryDashboardOrders, tableDataQueryDashboardOrders } from "../../pages/manager/dashboard/dashboard-orders";
import { cardsQueryDashboardInputTickets, chartQueryDashboardInputTickets, tableDataQueryDashboardInputTickets } from "../../pages/manager/dashboard/dashboard-input-tickets";

// Kiểu dữ liệu cho các tham số truyền vào
type FilterDashboardProps = {
  setFilterTimelineValue?: Dispatch<SetStateAction<string | null>>;
  setFilterTimeDetailValue?: Dispatch<SetStateAction<string | null>>;
  handleOnClick?: ({ timeline, timeDetail }: DashboardFilterTimeProps) => void;
  successLoadData?: boolean;
  typeDashboard?: string;
  titleDashboard?: string;
  dateDashboardStart?: string;
  dateDashboardEnd?: string;
  titlePrint?: string;
};
// Các giá trị chung
type FilterTimeDetailProps = {
  label: string | number;
  value: string | number;
};
const filterTimelineLabel = "Mốc thời gian";
const filterTimeDetailLabel = "Thời gian cụ thể";
export const filterYear = "Theo năm";
export const filterQuarter = "Theo quý";
export const filterMonth = "Theo tháng";
const yearStart = 2020;
const yearEnd = 2030;

// Filter Dashboard
const FilterDashboard: React.FC<FilterDashboardProps> = ({
  setFilterTimelineValue,
  setFilterTimeDetailValue,
  handleOnClick,
  successLoadData,
  typeDashboard,
  titleDashboard,
  dateDashboardStart,
  dateDashboardEnd,
  titlePrint,
}) => {
  // Các biến giữ giá trị từ việc lọc thông tin
  // - Mốc thời gian
  const timelineLabel = "Chọn " + filterTimelineLabel;
  const timelineOptions: SelectProps["options"] = [
    { label: filterYear, value: filterYear },
    { label: filterQuarter, value: filterQuarter },
    { label: filterMonth, value: filterMonth },
  ];
  const [timelineValue, setTimelineValue] = useState<string[] | null>([]);
  // - Thời gian cụ thể
  const timeDetailLabel = "Chọn " + filterTimeDetailLabel;
  const [changeTimeDetail, setChangeTimeDetail] = useState<
    FilterTimeDetailProps[]
  >([]);
  const timeDetailOptions: SelectProps["options"] = changeTimeDetail;
  const [timeDetailValue, setTimeDetailValue] = useState<string[] | null>([]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<ReactNode>();
  // - Hàm cập nhật
  const updatePropertiesModal = (
    titleModal: string,
    openModal: boolean,
    widthModal: string,
    classNameModal: string,
    childrenModal: ReactNode
  ) => {
    setTitleModal(titleModal);
    setOpenModal(openModal);
    setWidthModal(widthModal);
    setClassNameModal(classNameModal);
    setChildrenModal(childrenModal);
  };
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
      lineChartQueryDashboardProfit
    );
    const tableDataDashboardProfit = document.querySelector(
      tableDataQueryDashboardProfit
    );
    // - Thống kê Đơn món ăn
    const cardsDashboardOrders = document.querySelector(
      cardsQueryDashboardOrders
    );
    const chartDashboardOrders = document.querySelector(
      chartQueryDashboardOrders
    );
    const tableDataDashboardOrders = document.querySelector(
      tableDataQueryDashboardOrders
    );
    // - Thống kê Phiếu nhập
    const cardsDashboardInputTickets = document.querySelector(
      cardsQueryDashboardInputTickets
    );
    const chartDashboardInputTickets = document.querySelector(
      chartQueryDashboardInputTickets
    );
    const tableDataDashboardInputTickets = document.querySelector(
      tableDataQueryDashboardInputTickets
    );

    return (
      <>
        <div id="content-print" className="ticket__content">
          <header className="ticket__header">
            <img
              src="/src/assets/images/others/brand-image.png"
              alt="Logo Web"
              className="ticket__logo"
            />
            <div className="ticket__contact">
              <p>Nhà hàng VINAEATERY</p>
              <p>273 An Đ. Vương, Phường 2, Quận 5, Hồ Chí Minh 700000</p>
              <p>123456789 - 0987654321</p>
              <p>vinaeatery@gmail.com.vn</p>
            </div>
          </header>
          <main className="ticket__body input_ticket">
            <h1 className="ticket__title">{titleDashboard}</h1>
            <p className="ticket__date">
              Ngày thống kê: {dateDashboardStart} - {dateDashboardEnd}
            </p>
            {
              titleDashboard === "THỐNG KÊ LỢI NHUẬN" &&
              typeDashboard === "dashboard-profit" &&
              lineChartDashboardProfit && tableDataDashboardProfit && (
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
              )
            }
            {
              titleDashboard === "THỐNG KÊ ĐƠN MÓN ĂN" &&
              typeDashboard === "dashboard-orders" &&
              cardsDashboardOrders && chartDashboardOrders && tableDataDashboardOrders && (
                <>
                  <p className="ticket__info">
                    <b>Tóm tắt:</b>
                  </p>
                  <div
                    className="ticket__chart split-2"
                    dangerouslySetInnerHTML={{
                      __html: (cardsDashboardOrders?.outerHTML ?? "") + (chartDashboardOrders?.outerHTML ?? "")
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
              )
            }
            {
              titleDashboard === "THỐNG KÊ PHIẾU NHẬP" &&
              typeDashboard === "dashboard-input-tickets" &&
              cardsDashboardInputTickets && chartDashboardInputTickets && tableDataDashboardInputTickets && (
                <>
                  <p className="ticket__info">
                    <b>Tóm tắt:</b>
                  </p>
                  <div
                    className="ticket__chart split-2"
                    dangerouslySetInnerHTML={{
                      __html: (cardsDashboardInputTickets?.outerHTML ?? "") + (chartDashboardInputTickets?.outerHTML ?? "")
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
              )
            }
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
          <FontAwesomeIcon icon={faFileArrowDown} /> &nbsp;&nbsp;Tải xuống phiếu
        </button>
      </>
    );
  };

  // ...
  useEffect(() => {
    if (successLoadData) {
      setTimelineValue(["Theo năm"]);
      setTimeDetailValue(["Năm 2025"]);
    }
  }, [successLoadData]);
  // useEffect xử lý thay đổi chi tiết thời gian
  useEffect(() => {
    const timelineValueSelected = timelineValue?.[0] ?? null;
    let newTimeDetail: FilterTimeDetailProps[] = [];

    if (timelineValueSelected) {
      for (let i = yearStart; i <= yearEnd; i++) {
        if (timelineValueSelected === filterYear) {
          newTimeDetail.push({ label: `Năm ${i}`, value: `Năm ${i}` });
        } else if (timelineValueSelected === filterQuarter) {
          for (let j = 1; j <= 4; j++) {
            newTimeDetail.push({
              label: `Quý ${j}/${i}`,
              value: `Quý ${j}/${i}`,
            });
          }
        } else if (timelineValueSelected === filterMonth) {
          for (let j = 1; j <= 12; j++) {
            newTimeDetail.push({
              label: `Tháng ${j}/${i}`,
              value: `Tháng ${j}/${i}`,
            });
          }
        }
      }
    }

    setChangeTimeDetail(newTimeDetail);
    if (!timeDetailValue && newTimeDetail.length > 0) {
      setTimeDetailValue([]);
    }
  }, [timelineValue]);
  // useEffect chỉ truyền ngược giá trị cho component cha
  useEffect(() => {
    setFilterTimelineValue!(timelineValue?.[0] ?? null);
    setFilterTimeDetailValue!(timeDetailValue?.[0] ?? null);
  }, [timelineValue, timeDetailValue]);

  return (
    <>
      <CustomFindSelect
        mode={undefined}
        placeholder={timelineLabel}
        defaultValue={{ label: filterYear, value: filterYear }}
        optionFilterProp="label"
        maxTagCount="responsive"
        className="main__filter-select filter-timeline"
        options={timelineOptions}
        setFilterSelectValue={setTimelineValue}
      />
      <CustomFindSelect
        mode={undefined}
        placeholder={timeDetailLabel}
        defaultValue={{ label: "Năm 2025", value: "Năm 2025" }}
        optionFilterProp="label"
        maxTagCount="responsive"
        className="main__filter-select filter-timeDetail"
        options={timeDetailOptions}
        setFilterSelectValue={setTimeDetailValue}
      />
      <button
        className={"main__filter-button btn print"}
        style={{ width: "18%" }}
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

            updatePropertiesModal(
              "In phiếu thống kê",
              true,
              "80%",
              "print dashboard-profit",
              <PrintTicketModal />
            );
          } else {
            openNotification({
              type: "error",
              message: "Thất bại",
              description: React.Children.toArray([
                <p>In phiếu thống kê thất bại !</p>,
                !timelineValue?.[0] && <p> - Cần chọn {filterTimelineLabel}</p>,
                !timeDetailValue?.[0] && (
                  <p> - Cần chọn {filterTimeDetailLabel}</p>
                ),
              ]),
              duration: 1.5,
            });
          }

          // Xoá class 'active' thể hiện là nút không còn được nhấn
          e.currentTarget.classList.remove("active");
        }}
      >
        <FontAwesomeIcon icon={faPrint} className="icon" />
        &nbsp;In phiếu thống kê
      </button>
      {openModal && (
        <CustomModal
          title={titleModal}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
          width={widthModal}
          className={classNameModal}
          children={childrenModal}
        />
      )}
    </>
  );
};

export default FilterDashboard;
