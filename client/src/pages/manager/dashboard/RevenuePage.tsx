import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import SegmentedComponent from "../../../components/admin-manager/SegmentedComponent";
import StatisticCardComponent from "../../../components/admin-manager/StatisticCardComponent";
import BarChartComponent from "../../../components/admin-manager/BarChartComponent";
import PieChartComponent from "../../../components/admin-manager/PieChartComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterDashboardComponent from "../../../components/admin-manager/MainFilterDashboardComponent";
import MainTableRevenueDashboardComponent from "../../../components/admin-manager/MainTableRevenueDashboardComponent";
import RevenueApiService from "../../../services/api/v1/RevenueApiService";
import dayjs from "dayjs";
import { useState } from "react";
import {
  AppleOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FrownOutlined,
  PercentageOutlined,
  SmileOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { FilterDashboardTimelineValue } from "../../../constants/values";
import type { AdminManagerPageProps } from "../../../constants/props";
import type {
  RevenueSegmentKey,
  RevenueTypeEnum,
} from "../../../constants/enums";
import type { RevenueResponseType } from "../../../types/RevenueType";

const cardsId = "cards-dashboard-revenue";
const chartId = "chart-dashboard-revenue";
const tableDataId = "table-data-dashboard-revenue";
export const cardsQueryDashboardRevenue = `#${cardsId}`;
export const chartQueryDashboardRevenue = `div[class*='MuiChartsWrapper-root']:has(#${chartId})`;
export const tableDataQueryDashboardRevenue = `#${tableDataId}`;

const segmentedOptions = [
  { label: "Hoá đơn", value: "bill", icon: <FileDoneOutlined /> },
  { label: "Món ăn", value: "food", icon: <AppleOutlined /> },
  { label: "Bàn ăn", value: "table", icon: <TableOutlined /> },
];

const ManagerDashboardRevenuePage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
}) => {
  // Thông tin:  mã nhà hàng quản lý đã chọn ?
  const { restaurantIdForCrud } = useRestaurantContext({
    infoLogin,
    functionId,
  });

  // Các biến để lọc dữ liệu
  const [segmentValue, setSegmentValue] = useState<RevenueSegmentKey>("bill");
  const [filterTimelineValue, setFilterTimelineValue] = useState<string>(
    FilterDashboardTimelineValue.year,
  );
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<string>(
    "Năm " + dayjs().format("YYYY"),
  );

  // Truy vấn dữ liệu
  const { data: revenueData } = useEntityQuery<RevenueResponseType>({
    keys: [
      "revenue",
      restaurantIdForCrud,
      segmentValue,
      filterTimelineValue,
      filterTimeDetailValue,
    ],
    params: {
      restaurantId: restaurantIdForCrud,
      revenueType: segmentedOptions.find(
        (segmentedOption) => segmentedOption.value === segmentValue,
      )?.label as RevenueTypeEnum,
      timeline: filterTimelineValue!,
      timeDetail: filterTimeDetailValue!,
    },
    api: RevenueApiService.handleDashboard,
  });

  return (
    <main className="admin-manager-main">
      <MainHeaderComponent title={nameVN} />
      <MainFilterDashboardComponent
        restaurant={revenueData?.restaurant!}
        titleDashboard="THỐNG KÊ DOANH THU"
        titlePrint="TKDOANHTHU"
        typeDashboard="dashboard-revenue"
        dateDashboardStart={revenueData?.dateStart ?? ""}
        dateDashboardEnd={revenueData?.dateEnd ?? ""}
        filterTimeline={filterTimelineValue}
        filterTimeDetail={filterTimeDetailValue}
        setFilterTimeline={setFilterTimelineValue}
        setFilterTimeDetail={setFilterTimeDetailValue}
      />
      <div className="admin-manager-main__segmented">
        <SegmentedComponent
          options={segmentedOptions}
          setSelectedValue={(val) => setSegmentValue(val as RevenueSegmentKey)}
          className="segmented dashboard-revenue"
        />
      </div>
      <div className="admin-manager-main__chart split-2">
        <div id={cardsId} className="admin-manager-main__chart-card">
          <StatisticCardComponent
            title="Tổng doanh thu"
            value={revenueData?.card.total}
            prefix={<DollarCircleOutlined />}
            separator="."
            className="card-1"
          />
          <StatisticCardComponent
            title="Trung bình"
            value={revenueData?.card.average}
            prefix={<PercentageOutlined />}
            separator="."
            className="card-2"
          />
          <StatisticCardComponent
            title="Cao nhất"
            value={revenueData?.card.max}
            prefix={<SmileOutlined />}
            separator="."
            className="card-3"
          />
          <StatisticCardComponent
            title="Thấp nhất"
            value={revenueData?.card.min}
            prefix={<FrownOutlined />}
            separator="."
            className="card-4"
          />
        </div>
        {revenueData?.chart.bar ? (
          <BarChartComponent
            id={chartId}
            xAxisLabelValue="Thời gian"
            xAxisDataValue={revenueData?.chart.bar.xaxis}
            seriesLabelValue="Doanh thu"
            seriesDataValue={revenueData?.chart.bar.series}
          />
        ) : (
          <PieChartComponent
            id={chartId}
            data={revenueData?.chart.pie.data || []}
          />
        )}
      </div>
      <MainTableRevenueDashboardComponent
        id={tableDataId}
        className="revenue"
        segmentValue={segmentValue}
        billTableBody={
          segmentValue === "bill" ? revenueData?.table.billTableBody : []
        }
        billTableFoot={
          segmentValue === "bill"
            ? revenueData?.table.billTableFoot
            : {
                totalBill: 0,
                totalQuantity: 0,
                totalRevenue: 0,
              }
        }
        foodTableBody={
          segmentValue === "food" ? revenueData?.table.foodTableBody : []
        }
        foodTableFoot={
          segmentValue === "food"
            ? revenueData?.table.foodTableFoot
            : {
                totalQuantity: 0,
                totalRevenue: 0,
              }
        }
        tableTableBody={
          segmentValue === "table" ? revenueData?.table.tableTableBody : []
        }
        tableTableFoot={
          segmentValue === "table"
            ? revenueData?.table.tableTableFoot
            : {
                totalBill: 0,
                totalQuantity: 0,
                totalRevenue: 0,
              }
        }
      />
    </main>
  );
};

export default ManagerDashboardRevenuePage;
