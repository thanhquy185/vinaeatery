import React from "react";
import useModal from "../../hooks/useModal";
import ModalComponent from "../ModalComponent";
import PrintTicketModalComponent from "./PrintTicketModalComponent";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { Select } from "antd";
import { Printer } from "lucide-react";
import {
  FilterDashboardTimelineValue,
  FilterDashboardYearRangeValue,
  ModalWidthValue,
} from "../../constants/values";
import {
  lineChartQueryDashboardProfit,
  tableDataQueryDashboardProfit,
} from "../../pages/manager/dashboard/ProfitPage";
import {
  cardsQueryDashboardRevenue,
  chartQueryDashboardRevenue,
  tableDataQueryDashboardRevenue,
} from "../../pages/manager/dashboard/RevenuePage";
import {
  cardsQueryDashboardExpense,
  chartQueryDashboardExpense,
  tableDataQueryDashboardExpense,
} from "../../pages/manager/dashboard/ExpensePage";
import {
  cardsQueryDashboardFeedback,
  chartQueryDashboardFeedback,
  tableDataQueryDashboardFeedback,
} from "../../pages/manager/dashboard/FeedbackPage";
import { openNotification } from "../../utils/showNotificationUtil";
import type { RestaurantSubInfoResponseType } from "../../types/RestaurantType";

type MainFilterDashboardComponentProps = {
  restaurant: RestaurantSubInfoResponseType;
  titleDashboard: string;
  typeDashboard: string;
  dateDashboardStart: string;
  dateDashboardEnd: string;
  titlePrint: string;
  filterTimeline: string;
  filterTimeDetail: string;
  setFilterTimeline: (value: string) => void;
  setFilterTimeDetail: (value: string) => void;
};

const MainFilterDashboardComponent: React.FC<
  MainFilterDashboardComponentProps
> = ({
  restaurant,
  titleDashboard,
  titlePrint,
  typeDashboard,
  dateDashboardStart,
  dateDashboardEnd,
  filterTimeline,
  filterTimeDetail,
  setFilterTimeline,
  setFilterTimeDetail,
}) => {
  const timeDetailOptions = useMemo(() => {
    if (!filterTimeline) return [];

    const options: { label: string; value: string }[] = [];

    for (
      let year = FilterDashboardYearRangeValue.start;
      year <= FilterDashboardYearRangeValue.end;
      year++
    ) {
      if (filterTimeline === FilterDashboardTimelineValue.year) {
        options.push({ label: `Năm ${year}`, value: `Năm ${year}` });
      }
      if (filterTimeline === FilterDashboardTimelineValue.quarter) {
        for (let q = 1; q <= 4; q++) {
          options.push({
            label: `Quý ${q}/${year}`,
            value: `Quý ${q}/${year}`,
          });
        }
      }
      if (filterTimeline === FilterDashboardTimelineValue.month) {
        for (let m = 1; m <= 12; m++) {
          options.push({
            label: `Tháng ${m}/${year}`,
            value: `Tháng ${m}/${year}`,
          });
        }
      }
    }

    return options;
  }, [filterTimeline]);

  useEffect(() => {
    if (
      filterTimeline &&
      filterTimeDetail &&
      filterTimeline.split(" ")[1] ===
        filterTimeDetail.split(" ")[0].toLocaleLowerCase()
    ) {
      setFilterTimeline(filterTimeline);
      setFilterTimeDetail(filterTimeDetail);
    } else {
      if (filterTimeline === FilterDashboardTimelineValue.year) {
        setFilterTimeDetail("Năm " + dayjs().format("YYYY"));
      } else if (filterTimeline === FilterDashboardTimelineValue.quarter) {
        setFilterTimeDetail("Quý " + dayjs().format("Q/YYYY"));
      } else if (filterTimeline === FilterDashboardTimelineValue.month) {
        setFilterTimeDetail("Tháng " + dayjs().format("MM/YYYY"));
      }
    }
  }, [filterTimeline, filterTimeDetail]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Modal cho việc in phiếu thống kê
  const PrintTicketModal = () => {
    // Ngày hiện tại
    const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
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
    // - Thống kê Hoá đơn
    const cardsDashboardRevenue = document.querySelector(
      cardsQueryDashboardRevenue,
    );
    const chartDashboardRevenue = document.querySelector(
      chartQueryDashboardRevenue,
    );
    const tableDataDashboardRevenue = document.querySelector(
      tableDataQueryDashboardRevenue,
    );
    // - Thống kê Chi tiêu
    const cardsDashboardExpense = document.querySelector(
      cardsQueryDashboardExpense,
    );
    const chartDashboardExpense = document.querySelector(
      chartQueryDashboardExpense,
    );
    const tableDataDashboardExpense = document.querySelector(
      tableDataQueryDashboardExpense,
    );
    // - Thống kê Đánh giá
    const cardsDashboardFeedback = document.querySelector(
      cardsQueryDashboardFeedback,
    );
    const chartDashboardFeedback = document.querySelector(
      chartQueryDashboardFeedback,
    );
    const tableDataDashboardFeedback = document.querySelector(
      tableDataQueryDashboardFeedback,
    );

    return (
      <PrintTicketModalComponent
        restaurant={restaurant}
        mainContent={
          <>
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
              {titleDashboard === "THỐNG KÊ DOANH THU" &&
                typeDashboard === "dashboard-revenue" &&
                cardsDashboardRevenue &&
                chartDashboardRevenue &&
                tableDataDashboardRevenue && (
                  <>
                    <p className="ticket__info">
                      <b>Tóm tắt:</b>
                    </p>
                    <div
                      className="ticket__chart split-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          (cardsDashboardRevenue?.outerHTML ?? "") +
                          (chartDashboardRevenue?.outerHTML ?? ""),
                      }}
                    ></div>
                    <p className="ticket__info">
                      <b>Bảng dữ liệu:</b>
                    </p>
                    <div
                      className="ticket__chart"
                      dangerouslySetInnerHTML={{
                        __html: tableDataDashboardRevenue?.outerHTML ?? "",
                      }}
                    ></div>
                  </>
                )}
              {titleDashboard === "THỐNG KÊ CHI TIÊU" &&
                typeDashboard === "dashboard-expense" &&
                cardsDashboardExpense &&
                chartDashboardExpense &&
                tableDataDashboardExpense && (
                  <>
                    <p className="ticket__info">
                      <b>Tóm tắt:</b>
                    </p>
                    <div
                      className="ticket__chart split-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          (cardsDashboardExpense?.outerHTML ?? "") +
                          (chartDashboardExpense?.outerHTML ?? ""),
                      }}
                    ></div>
                    <p className="ticket__info">
                      <b>Bảng dữ liệu:</b>
                    </p>
                    <div
                      className="ticket__chart"
                      dangerouslySetInnerHTML={{
                        __html: tableDataDashboardExpense?.outerHTML ?? "",
                      }}
                    ></div>
                  </>
                )}
              {titleDashboard === "THỐNG KÊ ĐÁNH GIÁ" &&
                typeDashboard === "dashboard-feedback" &&
                cardsDashboardFeedback &&
                chartDashboardFeedback &&
                tableDataDashboardFeedback && (
                  <>
                    <p className="ticket__info">
                      <b>Tóm tắt:</b>
                    </p>
                    <div
                      className="ticket__chart split-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          (cardsDashboardFeedback?.outerHTML ?? "") +
                          (chartDashboardFeedback?.outerHTML ?? ""),
                      }}
                    ></div>
                    <p className="ticket__info">
                      <b>Bảng dữ liệu:</b>
                    </p>
                    <div
                      className="ticket__chart"
                      dangerouslySetInnerHTML={{
                        __html: tableDataDashboardFeedback?.outerHTML ?? "",
                      }}
                    ></div>
                  </>
                )}
            </main>
          </>
        }
        footerContent={
          <>
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
          </>
        }
        titlePdf={titlePrint}
        idPdf={typeDashboard}
        className="dashboard"
      />
    );
  };

  return (
    <>
      <div className="admin-manager-main__filter">
        <Select
          allowClear
          showSearch
          options={[
            {
              label: FilterDashboardTimelineValue.year,
              value: FilterDashboardTimelineValue.year,
            },
            {
              label: FilterDashboardTimelineValue.quarter,
              value: FilterDashboardTimelineValue.quarter,
            },
            {
              label: FilterDashboardTimelineValue.month,
              value: FilterDashboardTimelineValue.month,
            },
          ]}
          placeholder="Chọn Mốc thời gian"
          value={filterTimeline}
          onChange={(value) => setFilterTimeline(value)}
          className="filter-select dashboard"
        />
        <Select
          allowClear
          showSearch
          options={timeDetailOptions}
          placeholder="Chọn Thời gian cụ thể"
          value={filterTimeDetail}
          onChange={(value) => setFilterTimeDetail(value)}
          className="filter-select dashboard"
          disabled={!filterTimeline}
        />
        <button
          className="filter-print btn print"
          onClick={(e) => {
            e.currentTarget.classList.add("active");

            if (
              filterTimeline! &&
              filterTimeDetail! &&
              filterTimeline![0] &&
              filterTimeDetail![0]
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
                  !filterTimeline?.[0] && <p> - Cần chọn Mốc thời gian</p>,
                  !filterTimeDetail?.[0] && <p> - Cần chọn Thời gian cụ thể</p>,
                ]),
              });
            }

            e.currentTarget.classList.remove("active");
          }}
        >
          <Printer />
          <span>In phiếu thống kê</span>
        </button>
      </div>
      {modal.open && (
        <ModalComponent
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

export default MainFilterDashboardComponent;
