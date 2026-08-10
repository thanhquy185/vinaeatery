import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import LineChartComponent from "../../../components/admin-manager/LineChartComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterDashboardComponent from "../../../components/admin-manager/MainFilterDashboardComponent";
import MainTableProfitDashboardComponent from "../../../components/admin-manager/MainTableProfitDashboardComponent";
import ProfitApiService from "../../../services/api/v1/ProfitApiService";
import dayjs from "dayjs";
import { useState } from "react";
import { FilterDashboardTimelineValue } from "../../../constants/values";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { ProfitResponseType } from "../../../types/ProfitType";

const lineChartId = "line-chart-dashboard-profit";
const tableDataId = "table-data-dashboard-profit";
export const lineChartQueryDashboardProfit = `div[class*='MuiChartsWrapper-root']:has(#${lineChartId})`;
export const tableDataQueryDashboardProfit = `#${tableDataId}`;

const ManagerDashboardProfitPage: React.FC<AdminManagerPageProps> = ({
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
  const { data: profitData } = useEntityQuery<ProfitResponseType>({
    keys: [
      "profit",
      restaurantIdForCrud,
      filterTimelineValue,
      filterTimeDetailValue,
    ],
    params: {
      restaurantId: restaurantIdForCrud,
      timeline: filterTimelineValue!,
      timeDetail: filterTimeDetailValue!,
    },
    api: ProfitApiService.handleDashboard,
  });

  return (
    <main className="admin-manager-main">
      <MainHeaderComponent title={nameVN} />
      <MainFilterDashboardComponent
        restaurant={profitData?.restaurant!}
        titleDashboard="THỐNG KÊ LỢI NHUẬN"
        titlePrint="TKLOINHUAN"
        typeDashboard="dashboard-profit"
        dateDashboardStart={profitData?.dateStart ?? ""}
        dateDashboardEnd={profitData?.dateEnd ?? ""}
        filterTimeline={filterTimelineValue}
        filterTimeDetail={filterTimeDetailValue}
        setFilterTimeline={setFilterTimelineValue}
        setFilterTimeDetail={setFilterTimeDetailValue}
      />
      <div className="admin-manager-main__chart dashboard-profit">
        <LineChartComponent
          id={lineChartId}
          profitLine={profitData?.lineChart.profitLine}
          revenueLine={profitData?.lineChart.revenueLine}
          expenseLine={profitData?.lineChart.expenseLine}
          xLabels={profitData?.lineChart.xlabels}
        />
      </div>
      <MainTableProfitDashboardComponent
        id={tableDataId}
        className="profit"
        tableBody={profitData?.table.body}
        tableFoot={profitData?.table.foot}
      />
    </main>
  );
};

export default ManagerDashboardProfitPage;
