import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import StatisticCardComponent from "../../../components/admin-manager/StatisticCardComponent";
import PieChartComponent from "../../../components/admin-manager/PieChartComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterDashboardComponent from "../../../components/admin-manager/MainFilterDashboardComponent";
import MainTableFeedbackDashboardComponent from "../../../components/admin-manager/MainTableFeedbackDashboardComponent";
import DFeedbackApiService from "../../../services/api/v1/DFeedbackApiService";
import dayjs from "dayjs";
import { useState } from "react";
import {
  FrownOutlined,
  MessageOutlined,
  SmileOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { FilterDashboardTimelineValue } from "../../../constants/values";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { DFeedbackResponseType } from "../../../types/DFeedbackType";

const cardsId = "cards-dashboard-feedback";
const chartId = "chart-dashboard-feedback";
const tableDataId = "table-data-dashboard-feedback";
export const cardsQueryDashboardFeedback = `#${cardsId}`;
export const chartQueryDashboardFeedback = `div[class*='MuiChartsWrapper-root']:has(#${chartId})`;
export const tableDataQueryDashboardFeedback = `#${tableDataId}`;

const ManagerDashboardFeedbackPage: React.FC<AdminManagerPageProps> = ({
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
  const [filterTimelineValue, setFilterTimelineValue] = useState<string>(
    FilterDashboardTimelineValue.year,
  );
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<string>(
    "Năm " + dayjs().format("YYYY"),
  );

  // Truy vấn dữ liệu
  const { data: feedbackData } = useEntityQuery<DFeedbackResponseType>({
    keys: [
      "feedback",
      restaurantIdForCrud,
      filterTimelineValue,
      filterTimeDetailValue,
    ],
    params: {
      restaurantId: restaurantIdForCrud,
      timeline: filterTimelineValue!,
      timeDetail: filterTimeDetailValue!,
    },
    api: DFeedbackApiService.handleDashboard,
  });

  return (
    <main className="admin-manager-main">
      <MainHeaderComponent title={nameVN} />
      <div className="admin-manager-main__filter">
        <MainFilterDashboardComponent
          restaurant={feedbackData?.restaurant!}
          titleDashboard="THỐNG KÊ ĐÁNH GIÁ"
          titlePrint="TKDANHGIA"
          typeDashboard="dashboard-feedback"
          dateDashboardStart={feedbackData?.dateStart ?? ""}
          dateDashboardEnd={feedbackData?.dateEnd ?? ""}
          filterTimeline={filterTimelineValue}
          filterTimeDetail={filterTimeDetailValue}
          setFilterTimeline={setFilterTimelineValue}
          setFilterTimeDetail={setFilterTimeDetailValue}
        />
      </div>
      <div className="admin-manager-main__chart split-2">
        <div id={cardsId} className="admin-manager-main__chart-card">
          <StatisticCardComponent
            title="Tổng đánh giá"
            value={feedbackData?.card.total}
            prefix={<MessageOutlined />}
            separator="."
            className="card-1"
          />
          <StatisticCardComponent
            title="Trung bình"
            value={feedbackData?.card.average}
            prefix={<StarOutlined />}
            separator="."
            className="card-2"
          />
          <StatisticCardComponent
            title="Nhiều nhất"
            value={feedbackData?.card.max}
            prefix={<SmileOutlined />}
            separator="."
            className="card-3"
          />
          <StatisticCardComponent
            title="Ít nhất"
            value={feedbackData?.card.min}
            prefix={<FrownOutlined />}
            separator="."
            className="card-4"
          />
        </div>
        <PieChartComponent id={chartId} data={feedbackData?.chart.data || []} />
      </div>
      <MainTableFeedbackDashboardComponent
        id={tableDataId}
        className="feedback"
        tableBody={feedbackData?.table.tableBody}
        tableFoot={feedbackData?.table.tableFoot}
      />
    </main>
  );
};

export default ManagerDashboardFeedbackPage;
