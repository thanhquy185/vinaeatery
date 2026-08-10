import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import SegmentedComponent from "../../../components/admin-manager/SegmentedComponent";
import StatisticCardComponent from "../../../components/admin-manager/StatisticCardComponent";
import BarChartComponent from "../../../components/admin-manager/BarChartComponent";
import PieChartComponent from "../../../components/admin-manager/PieChartComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterDashboardComponent from "../../../components/admin-manager/MainFilterDashboardComponent";
import MainTableExpenseDashboardComponent from "../../../components/admin-manager/MainTableExpenseDashboardComponent";
import ExpenseApiService from "../../../services/api/v1/ExpenseApiService";
import dayjs from "dayjs";
import { useState } from "react";
import {
  DollarCircleOutlined,
  FileDoneOutlined,
  FrownOutlined,
  GoldOutlined,
  PercentageOutlined,
  SmileOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { FilterDashboardTimelineValue } from "../../../constants/values";
import type { AdminManagerPageProps } from "../../../constants/props";
import type {
  ExpenseSegmentKey,
  ExpenseTypeEnum,
} from "../../../constants/enums";
import type { ExpenseResponseType } from "../../../types/ExpenseType";

const cardsId = "cards-dashboard-expense";
const chartId = "chart-dashboard-expense";
const tableDataId = "table-data-dashboard-expense";
export const cardsQueryDashboardExpense = `#${cardsId}`;
export const chartQueryDashboardExpense = `div[class*='MuiChartsWrapper-root']:has(#${chartId})`;
export const tableDataQueryDashboardExpense = `#${tableDataId}`;

const segmentedOptions = [
  {
    label: "Phiếu nhập",
    value: "input-ticket",
    icon: <FileDoneOutlined />,
  },
  {
    label: "Nguyên liệu",
    value: "ingredient",
    icon: <GoldOutlined />,
  },
  { label: "Nhà cung cấp", value: "supplier", icon: <TagOutlined /> },
];

const ManagerDashboardExpensePage: React.FC<AdminManagerPageProps> = ({
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
  const [segmentValue, setSegmentValue] =
    useState<ExpenseSegmentKey>("input-ticket");
  const [filterTimelineValue, setFilterTimelineValue] = useState<string>(
    FilterDashboardTimelineValue.year,
  );
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<string>(
    "Năm " + dayjs().format("YYYY"),
  );

  // Truy vấn dữ liệu
  const { data: expenseData } = useEntityQuery<ExpenseResponseType>({
    keys: [
      "expense",
      restaurantIdForCrud,
      segmentValue,
      filterTimelineValue,
      filterTimeDetailValue,
    ],
    params: {
      restaurantId: restaurantIdForCrud,
      expenseType: segmentedOptions.find(
        (segmentedOption) => segmentedOption.value === segmentValue,
      )?.label as ExpenseTypeEnum,
      timeline: filterTimelineValue!,
      timeDetail: filterTimeDetailValue!,
    },
    api: ExpenseApiService.handleDashboard,
  });

  return (
    <main className="admin-manager-main">
      <MainHeaderComponent title={nameVN} />
      <MainFilterDashboardComponent
        restaurant={expenseData?.restaurant!}
        titleDashboard="THỐNG KÊ CHI TIÊU"
        titlePrint="TKCHITIEU"
        typeDashboard="dashboard-expense"
        dateDashboardStart={expenseData?.dateStart ?? ""}
        dateDashboardEnd={expenseData?.dateEnd ?? ""}
        filterTimeline={filterTimelineValue}
        filterTimeDetail={filterTimeDetailValue}
        setFilterTimeline={setFilterTimelineValue}
        setFilterTimeDetail={setFilterTimeDetailValue}
      />
      <div className="admin-manager-main__segmented">
        <SegmentedComponent
          options={segmentedOptions}
          setSelectedValue={(val) => setSegmentValue(val as ExpenseSegmentKey)}
          className="segmented dashboard-expense"
        />
      </div>
      <div className="admin-manager-main__chart split-2">
        <div id={cardsId} className="admin-manager-main__chart-card">
          <StatisticCardComponent
            title="Tổng chi tiêu"
            value={expenseData?.card.total}
            prefix={<DollarCircleOutlined />}
            separator="."
            className="card-1"
          />
          <StatisticCardComponent
            title="Trung bình"
            value={expenseData?.card.average}
            prefix={<PercentageOutlined />}
            separator="."
            className="card-2"
          />
          <StatisticCardComponent
            title="Cao nhất"
            value={expenseData?.card.max}
            prefix={<SmileOutlined />}
            separator="."
            className="card-3"
          />
          <StatisticCardComponent
            title="Thấp nhất"
            value={expenseData?.card.min}
            prefix={<FrownOutlined />}
            separator="."
            className="card-4"
          />
        </div>
        {expenseData?.chart.bar ? (
          <BarChartComponent
            id={chartId}
            xAxisLabelValue="Thời gian"
            xAxisDataValue={expenseData?.chart.bar.xaxis}
            seriesLabelValue="Chi tiêu"
            seriesDataValue={expenseData?.chart.bar.series}
          />
        ) : (
          <PieChartComponent
            id={chartId}
            data={expenseData?.chart.pie.data || []}
          />
        )}
      </div>
      <MainTableExpenseDashboardComponent
        id={tableDataId}
        className="expense"
        segmentValue={segmentValue}
        inputTicketTableBody={
          segmentValue === "input-ticket"
            ? expenseData?.table.inputTicketTableBody
            : []
        }
        inputTicketTableFoot={
          segmentValue === "input-ticket"
            ? expenseData?.table.inputTicketTableFoot
            : {
                totalInputTicket: 0,
                totalQuantity: 0,
                totalExpense: 0,
              }
        }
        ingredientTableBody={
          segmentValue === "ingredient"
            ? expenseData?.table.ingredientTableBody
            : []
        }
        ingredientTableFoot={
          segmentValue === "ingredient"
            ? expenseData?.table.ingredientTableFoot
            : {
                totalQuantity: 0,
                totalExpense: 0,
              }
        }
        supplierTableBody={
          segmentValue === "supplier"
            ? expenseData?.table.supplierTableBody
            : []
        }
        supplierTableFoot={
          segmentValue === "supplier"
            ? expenseData?.table.supplierTableFoot
            : {
                totalInputTicket: 0,
                totalQuantity: 0,
                totalExpense: 0,
              }
        }
      />
    </main>
  );
};

export default ManagerDashboardExpensePage;
