import { useEffect, useMemo, useState } from "react";
import {
  AppleOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FrownOutlined,
  PercentageOutlined,
  SmileOutlined,
  TableOutlined,
} from "@ant-design/icons";
import type { ManagerPageProps, PieChartProps } from "../../../common/props";
import type {
  FoodType,
  OrderType,
  TableType,
  UseTableType,
} from "../../../common/types";
import {
  OrderStatus,
  PayStatus,
  UserRoleValue,
  UseTableStatus,
} from "../../../common/values";
import CustomSegmented from "../../../components/admin-manager/common/segmented";
import CustomCardStatic from "../../../components/admin-manager/common/card-static";
import {
  CustomBarChart,
  CustomPieChart,
} from "../../../components/admin-manager/common/charts";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterDashboard from "../../../components/admin-manager/common/main-filter-dashboard";
import AdminManagerMainTableDashboard from "../../../components/admin-manager/common/main-table-dashboard";
import { FindAllTable } from "../../../requests/tables";
import { FindAllFood } from "../../../requests/foods";
import { FindAllOrder } from "../../../requests/orders";
import { FindAllUseTable } from "../../../requests/use-tables";
import { openNotification } from "../../../utils/show-notification";
import { getFilterTimesForDashboard } from "../../../utils/other-events";

const cardsId = "cards-dashboard-orders";
const chartId = "chart-dashboard-orders";
const tableDataId = "table-data-dashboard-orders";

export const cardsQueryDashboardOrders = `#${cardsId}`;
export const chartQueryDashboardOrders = `div[class*='MuiChartsWrapper-root']:has(#${chartId})`;
export const tableDataQueryDashboardOrders = `#${tableDataId}`;

type SegmentKey = "orders" | "foods" | "tables";
const segmentedOptions = [
  { label: "Đơn món ăn", value: "orders", icon: <FileDoneOutlined /> },
  { label: "Món ăn", value: "foods", icon: <AppleOutlined /> },
  { label: "Bàn ăn", value: "tables", icon: <TableOutlined /> },
];
const columnsWidthType: Record<SegmentKey, string[]> = {
  orders: ["10%", "10%", "10%", "22%", "22%", "26%"],
  foods: ["30%", "22%", "22%", "26%"],
  tables: ["30%", "22%", "22%", "26%"],
};
const columnsTitleType: Record<SegmentKey, string[]> = {
  orders: [
    "Tháng",
    "Từ ngày",
    "Đến ngày",
    "Tổng số đơn",
    "Tổng số món ăn",
    "Doanh thu",
  ],
  foods: ["Món ăn", "Giá bán", "Số lượng bán", "Doanh thu"],
  tables: ["Bàn ăn", "Tổng số đơn", "Tổng số món ăn", "Doanh thu"],
};
const formatsType: Record<SegmentKey, string[]> = {
  orders: ["", "", "", "", "", "price"],
  foods: ["info", "price", "", "price"],
  tables: ["info", "", "", "price"],
};

// Manager Dashboard Orders Page
const ManagerDashboardOrdersPage = ({
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
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [tables, setTables] = useState<TableType[]>([]);
  const [useTables, setUseTables] = useState<UseTableType[]>([]);
  const [loading, setLoading] = useState(false);

  const [segmentValue, setSegmentValue] = useState<SegmentKey>("orders");
  const [filterTimelineValue, setFilterTimelineValue] = useState<string | null>(
    null,
  );
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string | null
  >(null);

  const dashboardData = useMemo(() => {
    if (!filterTimelineValue || !filterTimeDetailValue) {
      return null;
    }

    const times = getFilterTimesForDashboard(
      filterTimelineValue,
      filterTimeDetailValue,
    );
    if (!times) return null;

    const dateStart = times[0].start;
    const dateEnd = times[times.length - 1].end;

    if (segmentValue === "orders") {
      let tbody: (string | number)[][] = [];
      let series: number[] = [];
      let revenues: number[] = [];

      times.forEach((time, index) => {
        let totalOrder = 0;
        let totalQuantity = 0;
        let revenue = 0;

        orders.forEach((o) => {
          const d = o.createAt?.split(" ")[0]!;
          if (d >= time.start && d <= time.end) {
            totalOrder++;
            revenue += o.totalPrice || 0;

            o.orderDetails?.forEach((od) => {
              totalQuantity += od.quantity;
            });
          }
        });

        revenues.push(revenue);
        series.push(revenue);

        tbody.push([
          index + 1,
          time.start,
          time.end,
          totalOrder,
          totalQuantity,
          revenue,
        ]);
      });

      const totalRevenue = revenues.reduce((a, b) => a + b, 0);

      return {
        card: {
          total: totalRevenue,
          average: revenues.length ? totalRevenue / revenues.length : 0,
          max: revenues.length ? Math.max(...revenues) : 0,
          min: revenues.length ? Math.min(...revenues) : 0,
        },
        chart: {
          type: "bar",
          xAxis: times.map((_, i) => "T" + (i + 1)),
          series,
        },
        table: {
          tbody,
          tfoot: [
            tbody.reduce((s, r) => s + (r[3] as number), 0),
            tbody.reduce((s, r) => s + (r[4] as number), 0),
            totalRevenue,
          ],
        },
        dateStart,
        dateEnd,
      };
    } else if (segmentValue === "foods") {
      let tbody: (string | number)[][] = [];
      let pie: PieChartProps[] = [];
      let revenues: number[] = [];

      foods.forEach((food) => {
        let quantity = 0;
        let revenue = 0;

        orders.forEach((order) => {
          const d = order.createAt?.split(" ")[0]!;
          if (d >= dateStart && d <= dateEnd) {
            order.orderDetails?.forEach((od) => {
              if (od.food.id === food.id) {
                quantity += od.quantity;
                revenue += od.price * od.quantity || 0;
              }
            });
          }
        });

        revenues.push(revenue);

        tbody.push([
          `${food.name} - ${food.categoryFood?.name} - ${food.unit}`,
          food.price || 0,
          quantity,
          revenue,
        ]);

        if (revenue > 0) {
          pie.push({
            id: food.id!,
            value: revenue,
            label: food.name!,
          });
        }
      });

      const totalRevenue = revenues.reduce((a, b) => a + b, 0);

      return {
        card: {
          total: totalRevenue,
          average: foods.length ? totalRevenue / foods.length : 0,
          max: revenues.length ? Math.max(...revenues) : 0,
          min: revenues.length ? Math.min(...revenues) : 0,
        },
        chart: { type: "pie", data: pie },
        table: {
          tbody,
          tfoot: [
            // tbody.reduce((s, r) => s + (r[1] as number), 0),
            tbody.reduce((s, r) => s + (r[2] as number), 0),
            totalRevenue,
          ],
        },
        dateStart,
        dateEnd,
      };
    } else if (segmentValue === "tables") {
      let tbody: (string | number)[][] = [];
      let pie: PieChartProps[] = [];
      let revenues: number[] = [];

      tables.forEach((table) => {
        let totalOrder = 0;
        let totalQuantity = 0;
        let revenue = 0;

        useTables.forEach((ut) => {
          const start = ut.timeStart?.split(" ")[0]!;
          if (
            ut.table?.id === table.id &&
            start >= dateStart &&
            start <= dateEnd
          ) {
            totalOrder++;
            revenue += ut.order?.totalPrice || 0;

            ut.order?.orderDetails?.forEach((od) => {
              totalQuantity += od.quantity;
            });
          }
        });

        revenues.push(revenue);

        tbody.push([
          `${table.name} - ${table.floor?.name} - ${table.categoryTable?.name}`,
          totalOrder,
          totalQuantity,
          revenue,
        ]);

        if (revenue > 0) {
          pie.push({
            id: table.id!,
            value: revenue,
            label: table.name!,
          });
        }
      });

      const totalRevenue = revenues.reduce((a, b) => a + b, 0);

      return {
        card: {
          total: totalRevenue,
          average: tables.length ? totalRevenue / tables.length : 0,
          max: revenues.length ? Math.max(...revenues) : 0,
          min: revenues.length ? Math.min(...revenues) : 0,
        },
        chart: { type: "pie", data: pie },
        table: {
          tbody,
          tfoot: [
            tbody.reduce((s, r) => s + (r[1] as number), 0),
            tbody.reduce((s, r) => s + (r[2] as number), 0),
            totalRevenue,
          ],
        },
        dateStart,
        dateEnd,
      };
    }

    return null;
  }, [
    segmentValue,
    filterTimelineValue,
    filterTimeDetailValue,
    orders,
    foods,
    tables,
    useTables,
  ]);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderRes, foodRes, tableRes, useTableRes] = await Promise.all([
          FindAllOrder({
            restaurantId,
            statusValue: [OrderStatus.confirm, PayStatus.pay],
          }),
          FindAllFood({ restaurantId }),
          FindAllTable({ restaurantId }),
          FindAllUseTable({
            restaurantId,
            statusValue: [UseTableStatus.occupied],
          }),
        ]);

        if (orderRes?.status === 200) setOrders(orderRes.data);
        if (foodRes?.status === 200) setFoods(foodRes.data);
        if (tableRes?.status === 200) setTables(tableRes.data);
        if (useTableRes?.status === 200) setUseTables(useTableRes.data);
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
      <div className="admin-manager-main__segmented">
        <CustomSegmented
          options={segmentedOptions}
          setSelectedValue={(val) => setSegmentValue(val as SegmentKey)}
          className="segmented dashboard-orders"
        />
      </div>
      <AdminManagerMainFilterDashboard
        setFilterTimelineValue={setFilterTimelineValue}
        setFilterTimeDetailValue={setFilterTimeDetailValue}
        successLoadData={!loading}
        titleDashboard="THỐNG KÊ ĐƠN MÓN ĂN"
        titlePrint="TKDONMONAN"
        typeDashboard="dashboard-orders"
        dateDashboardStart={dashboardData?.dateStart}
        dateDashboardEnd={dashboardData?.dateEnd}
      />
      <div className="admin-manager-main__chart split-2">
        <div id={cardsId} className="admin-manager-main__chart-card">
          <CustomCardStatic
            title="Tổng doanh thu"
            value={dashboardData?.card.total}
            prefix={<DollarCircleOutlined />}
            separator="."
            className="card-1"
          />
          <CustomCardStatic
            title="Trung bình"
            value={dashboardData?.card.average}
            prefix={<PercentageOutlined />}
            separator="."
            className="card-2"
          />
          <CustomCardStatic
            title="Cao nhất"
            value={dashboardData?.card.max}
            prefix={<SmileOutlined />}
            separator="."
            className="card-3"
          />
          <CustomCardStatic
            title="Thấp nhất"
            value={dashboardData?.card.min}
            prefix={<FrownOutlined />}
            separator="."
            className="card-4"
          />
        </div>
        {dashboardData?.chart.type === "bar" ? (
          <CustomBarChart
            id={chartId}
            xAxisLabelValue="Thời gian"
            xAxisDataValue={dashboardData?.chart.xAxis}
            seriesLabelValue="Doanh thu"
            seriesDataValue={dashboardData?.chart.series}
          />
        ) : (
          <CustomPieChart
            id={chartId}
            dataValue={dashboardData?.chart.data || []}
          />
        )}
      </div>
      <AdminManagerMainTableDashboard
        id={tableDataId}
        className="revenue"
        columnsWidth={columnsWidthType[segmentValue]}
        columnsTitle={columnsTitleType[segmentValue]}
        format={formatsType[segmentValue]}
        tbody={dashboardData?.table.tbody}
        tfoot={dashboardData?.table.tfoot}
      />
    </main>
  );
};

export default ManagerDashboardOrdersPage;
