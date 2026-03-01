import { useEffect, useMemo, useState } from "react";
import {
  DollarCircleOutlined,
  FileDoneOutlined,
  FrownOutlined,
  GoldOutlined,
  PercentageOutlined,
  SmileOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type {
  IngredientType,
  InputTicketType,
  SupplierType,
} from "../../../common/types";
import type { ManagerPageProps, PieChartProps } from "../../../common/props";
import {
  InputTicketStatus,
  PayStatus,
  UserRoleValue,
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
import { FindAllIngredient } from "../../../requests/ingredients";
import { FindAllSupplier } from "../../../requests/suppliers";
import { FindAllInputTicket } from "../../../requests/input-tickets";
import { openNotification } from "../../../utils/show-notification";
import { getFilterTimesForDashboard } from "../../../utils/other-events";

const cardsId = "cards-dashboard-input-tickets";
const chartId = "chart-dashboard-input-tickets";
const tableDataId = "table-data-dashboard-input-tickets";

export const cardsQueryDashboardInputTickets = `#${cardsId}`;
export const chartQueryDashboardInputTickets = `div[class*='MuiChartsWrapper-root']:has(#${chartId})`;
export const tableDataQueryDashboardInputTickets = `#${tableDataId}`;

type SegmentKey = "input-tickets" | "ingredients" | "suppliers";
const segmentedOptions = [
  {
    label: "Phiếu nhập",
    value: "input-tickets",
    icon: <FileDoneOutlined />,
  },
  {
    label: "Nguyên liệu",
    value: "ingredients",
    icon: <GoldOutlined />,
  },
  { label: "Nhà cung cấp", value: "suppliers", icon: <TagOutlined /> },
];
const columnsWidthType: Record<SegmentKey, string[]> = {
  "input-tickets": ["10%", "10%", "10%", "22%", "22%", "26%"],
  ingredients: ["30%", "22%", "22%", "26%"],
  suppliers: ["30%", "22%", "22%", "26%"],
};

const columnsTitleType: Record<SegmentKey, string[]> = {
  "input-tickets": [
    "Tháng",
    "Từ ngày",
    "Đến ngày",
    "Tổng số phiếu",
    "Tổng số nguyên liệu",
    "Chi tiêu",
  ],
  ingredients: ["Nguyên liệu", "Giá nhập", "Số lượng nhập", "Chi tiêu"],
  suppliers: [
    "Nhà cung cấp",
    "Tổng số phiếu",
    "Tổng số nguyên liệu",
    "Chi tiêu",
  ],
};
const formatsType: Record<SegmentKey, string[]> = {
  "input-tickets": ["", "", "", "", "", "price"],
  ingredients: ["info", "price", "", "price"],
  suppliers: ["info", "", "", "price"],
};

const ManagerDashboardInputTicketsPage = ({
  infoLogin,
  nameVN,
}: ManagerPageProps) => {
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id"),
  );
  const restaurantId = isManager
    ? selectedRestaurantId
    : infoLogin?.restaurantId;

  const [inputTickets, setInputTickets] = useState<InputTicketType[]>([]);
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [loading, setLoading] = useState(false);

  const [segmentValue, setSegmentValue] = useState<SegmentKey>("input-tickets");
  const [filterTimelineValue, setFilterTimelineValue] = useState<string | null>(
    null,
  );
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string | null
  >(null);

  const dashboardData = useMemo(() => {
    if (!filterTimelineValue || !filterTimeDetailValue) return null;

    const times = getFilterTimesForDashboard(
      filterTimelineValue,
      filterTimeDetailValue,
    );
    if (!times) return null;

    const dateStart = times[0].start;
    const dateEnd = times[times.length - 1].end;

    if (segmentValue === "input-tickets") {
      let tbody: (string | number)[][] = [];
      let expenses: number[] = [];
      let series: number[] = [];

      times.forEach((time, index) => {
        let totalTicket = 0;
        let totalQuantity = 0;
        let expense = 0;

        inputTickets.forEach((ticket) => {
          const d = ticket.createAt?.split(" ")[0]!;
          if (d >= time.start && d <= time.end) {
            totalTicket++;
            expense += ticket.totalPrice || 0;

            ticket.inputTicketDetails?.forEach((d) => {
              totalQuantity += d.quantity || 0;
            });
          }
        });

        expenses.push(expense);
        series.push(expense);

        tbody.push([
          index + 1,
          time.start,
          time.end,
          totalTicket,
          totalQuantity,
          expense,
        ]);
      });

      const totalExpense = expenses.reduce((a, b) => a + b, 0);

      return {
        card: {
          total: totalExpense,
          average: expenses.length ? totalExpense / expenses.length : 0,
          max: expenses.length ? Math.max(...expenses) : 0,
          min: expenses.length ? Math.min(...expenses) : 0,
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
            totalExpense,
          ],
        },
        dateStart,
        dateEnd,
      };
    } else if (segmentValue === "ingredients") {
      let tbody: (string | number)[][] = [];
      let pie: PieChartProps[] = [];
      let expenses: number[] = [];

      ingredients.forEach((ingredient) => {
        let quantity = 0;
        let expense = 0;

        inputTickets.forEach((ticket) => {
          const d = ticket.createAt?.split(" ")[0]!;
          if (d >= dateStart && d <= dateEnd) {
            ticket.inputTicketDetails?.forEach((ipd) => {
              if (ipd?.ingredient?.id === ingredient.id) {
                quantity += ipd?.quantity || 0;
                expense += ipd?.quantity! * ipd?.price! || 0;
              }
            });
          }
        });

        expenses.push(expense);

        tbody.push([
          `${ingredient.name!} - ${ingredient.categoryIngredient?.name} - ${ingredient.capacity} ${ingredient.unit}`,
          ingredient.inputPrice || 0,
          quantity,
          expense,
        ]);

        if (expense > 0) {
          pie.push({
            id: ingredient.id!,
            value: expense,
            label: ingredient.name!,
          });
        }
      });

      const totalExpense = expenses.reduce((a, b) => a + b, 0);

      return {
        card: {
          total: totalExpense,
          average: ingredients.length ? totalExpense / ingredients.length : 0,
          max: expenses.length ? Math.max(...expenses) : 0,
          min: expenses.length ? Math.min(...expenses) : 0,
        },
        chart: { type: "pie", data: pie },
        table: {
          tbody,
          tfoot: [
            tbody.reduce((s, r) => s + (r[2] as number), 0),
            totalExpense,
          ],
        },
        dateStart,
        dateEnd,
      };
    } else if (segmentValue === "suppliers") {
      let tbody: (string | number)[][] = [];
      let pie: PieChartProps[] = [];
      let expenses: number[] = [];

      suppliers.forEach((supplier) => {
        let totalTicket = 0;
        let totalQuantity = 0;
        let expense = 0;

        inputTickets.forEach((ticket) => {
          const d = ticket.createAt?.split(" ")[0]!;
          if (
            ticket.supplier?.id === supplier.id &&
            d >= dateStart &&
            d <= dateEnd
          ) {
            totalTicket++;
            expense += ticket.totalPrice || 0;

            ticket.inputTicketDetails?.forEach((detail) => {
              totalQuantity += detail.quantity || 0;
            });
          }
        });

        expenses.push(expense);

        tbody.push([supplier.name!, totalTicket, totalQuantity, expense]);

        if (expense > 0) {
          pie.push({
            id: supplier.id!,
            value: expense,
            label: supplier.name!,
          });
        }
      });

      const totalExpense = expenses.reduce((a, b) => a + b, 0);

      return {
        card: {
          total: totalExpense,
          average: suppliers.length ? totalExpense / suppliers.length : 0,
          max: expenses.length ? Math.max(...expenses) : 0,
          min: expenses.length ? Math.min(...expenses) : 0,
        },
        chart: { type: "pie", data: pie },
        table: {
          tbody,
          tfoot: [
            tbody.reduce((s, r) => s + (r[1] as number), 0),
            tbody.reduce((s, r) => s + (r[2] as number), 0),
            totalExpense,
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
    inputTickets,
    ingredients,
    suppliers,
  ]);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [ticketRes, ingredientRes, supplierRes] = await Promise.all([
          FindAllInputTicket({
            statusValue: [InputTicketStatus.confirm, PayStatus.pay],
            restaurantId,
          }),
          FindAllIngredient({ restaurantId }),
          FindAllSupplier({ restaurantId }),
        ]);

        if (ticketRes?.status === 200) setInputTickets(ticketRes.data);
        if (ingredientRes?.status === 200) setIngredients(ingredientRes.data);
        if (supplierRes?.status === 200) setSuppliers(supplierRes.data);
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
          className="segmented dashboard-input-tickets"
        />
      </div>
      <AdminManagerMainFilterDashboard
        setFilterTimelineValue={setFilterTimelineValue}
        setFilterTimeDetailValue={setFilterTimeDetailValue}
        successLoadData={!loading}
        typeDashboard="dashboard-input-tickets"
        titleDashboard="THỐNG KÊ PHIẾU NHẬP"
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
            seriesLabelValue="Chi tiêu"
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
        className="expense"
        columnsWidth={columnsWidthType[segmentValue]}
        columnsTitle={columnsTitleType[segmentValue]}
        format={formatsType[segmentValue]}
        tbody={dashboardData?.table.tbody}
        tfoot={dashboardData?.table.tfoot}
      />
    </main>
  );
};

export default ManagerDashboardInputTicketsPage;
