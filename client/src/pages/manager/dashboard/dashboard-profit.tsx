import { useEffect, useMemo, useState } from "react";
import type { ManagerPageProps } from "../../../common/props";
import type { InputTicketType, OrderType } from "../../../common/types";
import {
  InputTicketStatus,
  OrderStatus,
  PayStatus,
  UserRoleValue,
} from "../../../common/values";
import { CustomLineChart } from "../../../components/admin-manager/common/charts";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterDashboard from "../../../components/admin-manager/common/main-filter-dashboard";
import AdminManagerMainTableDashboard from "../../../components/admin-manager/common/main-table-dashboard";
import { FindAllOrder } from "../../../requests/orders";
import { FindAllInputTicket } from "../../../requests/input-tickets";
import { openNotification } from "../../../utils/show-notification";
import { getFilterTimesForDashboard } from "../../../utils/other-events";

const lineChartId = "line-chart-dashboard-profit";
const tableDataId = "table-data-dashboard-profit";

export const lineChartQueryDashboardProfit = `div[class*='MuiChartsWrapper-root']:has(#${lineChartId})`;
export const tableDataQueryDashboardProfit = `#${tableDataId}`;

// Manager Dashboard Profit Page
const ManagerDashboardProfitPage = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}: ManagerPageProps) => {
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id"),
  );
  const restaurantId = isManager
    ? selectedRestaurantId
    : infoLogin?.restaurantId;

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [inputTickets, setInputTickets] = useState<InputTicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterTimelineValue, setFilterTimelineValue] = useState<string | null>(
    null,
  );
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string | null
  >(null);
  const columnsWidthValue = ["10%", "10%", "10%", "23%", "23%", "24%"];
  const columnsTitleValue = [
    filterTimeDetailValue?.toLowerCase().includes("năm") ? "Tháng" : "Tuần",
    "Từ ngày",
    "Đến ngày",
    "Doanh thu",
    "Chi tiêu",
    "Lợi nhuận",
  ];
  const formatValue = ["", "", "", "price", "price", "price"];

  const dashboardData = useMemo(() => {
    if (!filterTimelineValue || !filterTimeDetailValue) {
      return {
        revenueLine: [],
        expenseLine: [],
        profitLine: [],
        xLabels: [],
        tbody: [],
        tfoot: [],
      };
    }

    const times = getFilterTimesForDashboard(
      filterTimelineValue,
      filterTimeDetailValue,
    );

    if (!times) {
      return {
        revenueLine: [],
        expenseLine: [],
        profitLine: [],
        xLabels: [],
        tbody: [],
        tfoot: [],
      };
    }

    let revenueLine: number[] = [];
    let expenseLine: number[] = [];
    let profitLine: number[] = [];
    let xLabels: string[] = [];
    let tbody: (string | number)[][] = [];

    let totalRevenue = 0;
    let totalExpense = 0;
    let totalProfit = 0;

    times.forEach((time, index) => {
      const revenue = orders.reduce((total, order) => {
        const date = order.createAt?.split(" ")[0]!;
        if (date >= time.start && date <= time.end) {
          return total + (order.totalPrice || 0);
        }
        return total;
      }, 0);

      const expense = inputTickets.reduce((total, ticket) => {
        const date = ticket.createAt?.split(" ")[0]!;
        if (date >= time.start && date <= time.end) {
          return total + (ticket.totalPrice || 0);
        }
        return total;
      }, 0);

      const profit = revenue - expense;

      revenueLine.push(revenue);
      expenseLine.push(expense);
      profitLine.push(profit);

      const prefix = filterTimeDetailValue.toLowerCase().includes("năm")
        ? "Tháng "
        : "Tuần ";

      xLabels.push(prefix + (index + 1));

      tbody.push([index + 1, time.start, time.end, revenue, expense, profit]);

      totalRevenue += revenue;
      totalExpense += expense;
      totalProfit += profit;
    });

    return {
      revenueLine,
      expenseLine,
      profitLine,
      xLabels,
      tbody,
      tfoot: [totalRevenue, totalExpense, totalProfit],
    };
  }, [filterTimelineValue, filterTimeDetailValue, orders, inputTickets]);

  useEffect(() => {
    const fetchData = async () => {
      if (!restaurantId) return;

      setLoading(true);

      try {
        const [orderRes, inputRes] = await Promise.all([
          FindAllOrder({
            statusValue: [OrderStatus.confirm, PayStatus.pay],
            restaurantId,
          }),
          FindAllInputTicket({
            statusValue: [InputTicketStatus.confirm, PayStatus.pay],
            restaurantId,
          }),
        ]);

        if (orderRes?.status === 200) {
          setOrders(orderRes.data);
        } else {
          throw new Error();
        }

        if (inputRes?.status === 200) {
          setInputTickets(inputRes.data);
        } else {
          throw new Error();
        }
      } catch {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  return (
    <main className="admin-manager-main">
      <AdminManagerMainHeader title={nameVN} />
      <AdminManagerMainFilterDashboard
        setFilterTimelineValue={setFilterTimelineValue}
        setFilterTimeDetailValue={setFilterTimeDetailValue}
        successLoadData={!loading}
        titleDashboard="THỐNG KÊ LỢI NHUẬN"
        titlePrint="TKLOINHUAN"
        typeDashboard="dashboard-profit"
        dateDashboardStart={
          dashboardData.tbody.length > 0
            ? (dashboardData.tbody[0][1] as string)
            : ""
        }
        dateDashboardEnd={
          dashboardData.tbody.length > 0
            ? (dashboardData.tbody[dashboardData.tbody.length - 1][2] as string)
            : ""
        }
      />
      <div className="admin-manager-main__chart dashboard-profit">
        <CustomLineChart
          id={lineChartId}
          profitLineValue={dashboardData.profitLine}
          revenueLineValue={dashboardData.revenueLine}
          expenseLineValue={dashboardData.expenseLine}
          xLabelsValue={dashboardData.xLabels}
        />
      </div>
      <AdminManagerMainTableDashboard
        id={tableDataId}
        className="profit"
        columnsWidth={columnsWidthValue}
        columnsTitle={columnsTitleValue}
        format={formatValue}
        tbody={dashboardData.tbody}
        tfoot={dashboardData.tfoot}
      />
    </main>
  );
};

export default ManagerDashboardProfitPage;
