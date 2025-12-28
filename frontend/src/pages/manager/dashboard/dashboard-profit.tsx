import { useEffect, useState } from "react";
import type {
  InputTicketsFormatType,
  OrdersFormatType,
} from "../../../common/types";
import {
  InputTicketStatus,
  OrderStatus,
  PayStatus,
  UserRoleValue,
} from "../../../common/values";
import { CustomLineChart } from "../../../components/admin-manager/charts";
import CustomTableDashboard from "../../../components/admin-manager/table-dashboard";
import FilterDashboard from "../../../components/admin-manager/filter-dashboard";
import { FindAllInputTicket, FindAllOrder } from "../../../services/api";
import { getFilterTimesForDashboard } from "../../../utils/otherEvents";
import { openNotification } from "../../../utils/showNotification";
import type { ManagerPageProps } from "../../../common/props";

// Các giá trị chung
const lineChartId = "line-chart-dashboard-profit";
const tableDataId = "table-data-dashboard-profit";

// Các chuỗi để lấy được biểu đồ, bảng dữ liệu thông qua css selector
export const lineChartQueryDashboardProfit = `div[class*='MuiChartsWrapper-root']:has(#${lineChartId})`;
export const tableDataQueryDashboardProfit = `#${tableDataId}`;

// Manager Dashboard Profit Page
const ManagerDashboardProfitPage = ({ infoLogin }: ManagerPageProps) => {
  // Có là chủ nhà hàng đăng nhập
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  // Mã nhà hàng được chọn (dành cho chủ nhà hàng)
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id")
  );
  useEffect(() => {
    getAllOrder().finally(() => setOrdersReady(true));
    getAllInputTicket().finally(() => setInputTicketsReady(true));
  }, [selectedRestaurantId]);

  // Các thành phần giữ giá trị cho việc hiển thị bảng thống kê
  const [orders, setOrders] = useState<OrdersFormatType[]>([]);
  const [inputTickets, setInputTickets] = useState<InputTicketsFormatType[]>(
    []
  );

  // Các biến giữ giá trị để biết khi nào dữ liệu đã load xong
  const [ordersReady, setOrdersReady] = useState<boolean>(false);
  const [inputTicketsReady, setInputTicketsReady] = useState<boolean>(false);

  // Các biến giữ giá trị từ việc lọc thông tin
  const [filterTimelineValue, setFilterTimelineValue] = useState<string | null>(
    null
  );
  // - Thời gian cụ thể
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string | null
  >(null);

  // Các biến giữ giá trị cho việc thống kê theo biểu đồ đường
  const [profitLineValue, setProfitLineValue] = useState<number[]>([]);
  const [revenueLineValue, setRevenueLineValue] = useState<number[]>([]);
  const [expenseLineValue, setExpenseLineValue] = useState<number[]>([]);
  const [xLabelsValue, setXLabelsValue] = useState<string[]>([]);

  // Các biến giữ giá trị cho việc thống kê theo bảng dữ liệu
  const columnsWidthValue = ["10%", "10%", "10%", "23%", "23%", "24%"];
  const columnsTitleValue = [
    filterTimeDetailValue?.toLocaleLowerCase().includes("năm")
      ? "Tháng"
      : "Tuần",
    "Từ ngày",
    "Đến ngày",
    "Doanh thu",
    "Chi tiêu",
    "Lợi nhuận",
  ];
  const formatValue = ["", "", "", "price", "price", "price"];
  const [tbodyValue, setTbodyValue] = useState<(string | number)[][]>([]);
  const [tfootValue, setTfootValue] = useState<(string | number)[]>([]);

  // Hàm cập nhật lại các biến giữ giá trị cho việc thống kê
  const restDataDashboard = () => {
    // - Biểu đồ đường
    setProfitLineValue([]);
    setRevenueLineValue([]);
    setExpenseLineValue([]);
    setXLabelsValue([]);

    // Bảng dữ liệu
    setTbodyValue([]);
    setTfootValue([]);
  };
  // Hàm cập nhật danh sách các đơn món ăn, phiếu nhập (gọi API)
  const getAllOrder = async () => {
    const res = await FindAllOrder({
      statusValue: [OrderStatus.confirm, PayStatus.pay],
      restaurantId: isManager ? selectedRestaurantId : infoLogin?.restaurantId,
    });
    if (res!.status === 200) {
      setOrders(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  const getAllInputTicket = async () => {
    const res = await FindAllInputTicket({
      statusValue: [InputTicketStatus.confirm, PayStatus.pay],
      restaurantId: isManager ? selectedRestaurantId : infoLogin?.restaurantId,
    });
    if (res!.status === 200) {
      setInputTickets(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };

  //
  useEffect(() => {
    getAllOrder().finally(() => setOrdersReady(true));
    getAllInputTicket().finally(() => setInputTicketsReady(true));
  }, []);
  //
  useEffect(() => {
    if (filterTimelineValue && filterTimeDetailValue) {
      const times = getFilterTimesForDashboard(
        filterTimelineValue,
        filterTimeDetailValue
      );
      if (times) {
        // Biểu đồ đường
        let newRevenueLineValue: number[] = [],
          newExpenseLineValue: number[] = [],
          newProfitLineValue: number[] = [],
          newXLabelsValue: string[] = [];
        times?.map((time, index) => {
          // - Doanh thu
          const revenueValue = orders.reduce((total, order) => {
            const dateCreate = order.createAt?.split(" ")[0]!;
            if (dateCreate >= time.start && dateCreate <= time.end) {
              return total + (order.totalPrice || 0);
            }

            return total;
          }, 0);
          newRevenueLineValue.push(revenueValue);

          // - Chi tiêu
          // -- Nguyên liệu
          const inputTicketTotalPrice = inputTickets.reduce(
            (total, inputTicket) => {
              const dateCreate = inputTicket.createAt?.split(" ")[0]!;
              if (dateCreate >= time.start && dateCreate <= time.end) {
                return total + (inputTicket.totalPrice || 0);
              }

              return total;
            },
            0
          );
          // -- Tiền lương
          // -- Phí khác
          const expenseValue = inputTicketTotalPrice;
          newExpenseLineValue.push(expenseValue);

          // - Lợi nhuận
          newProfitLineValue.push(revenueValue - expenseValue);

          // - Nhãn dán
          const prefixXLabel = filterTimeDetailValue
            .toLocaleLowerCase()
            .includes("năm")
            ? "Tháng "
            : "Tuần ";
          newXLabelsValue.push(prefixXLabel + (index + 1));
        });
        setRevenueLineValue(newRevenueLineValue);
        setExpenseLineValue(newExpenseLineValue);
        setProfitLineValue(newProfitLineValue);
        setXLabelsValue(newXLabelsValue);

        // Bảng dữ liệu
        let newTbodyValue: (string | number)[][] = [],
          newTotalRevenueValue: number = 0,
          newTotalExpenseValue: number = 0,
          newTotalProfitValue: number = 0;
        times?.map((time, index) => {
          // - Doanh thu
          const revenueValue = orders.reduce((total, order) => {
            const dateCreate = order.createAt?.split(" ")[0]!;
            if (dateCreate >= time.start && dateCreate <= time.end) {
              return total + (order.totalPrice || 0);
            }

            return total;
          }, 0);

          // - Chi tiêu
          // -- Nguyên liệu
          const inputTicketTotalPrice = inputTickets.reduce(
            (total, inputTicket) => {
              const dateCreate = inputTicket.createAt?.split(" ")[0]!;
              if (dateCreate >= time.start && dateCreate <= time.end) {
                return total + (inputTicket.totalPrice || 0);
              }

              return total;
            },
            0
          );
          // -- Tiền lương
          // -- Phí khác
          const expenseValue = inputTicketTotalPrice;

          // - Lợi nhuận
          const profitValue = revenueValue - expenseValue;

          // -
          newTbodyValue.push([
            index + 1,
            time.start,
            time.end,
            revenueValue,
            expenseValue,
            profitValue,
          ]);
          newTotalRevenueValue += revenueValue;
          newTotalExpenseValue += expenseValue;
          newTotalProfitValue += profitValue;
        });
        setTbodyValue(newTbodyValue);
        setTfootValue([
          newTotalRevenueValue,
          newTotalExpenseValue,
          newTotalProfitValue,
        ]);
      }
    } else {
      restDataDashboard();
    }
  }, [filterTimelineValue, filterTimeDetailValue]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <div className="main__title">Thống kê Lợi nhuận</div>
        </div>
        <div className="main__filter">
          <FilterDashboard
            setFilterTimelineValue={setFilterTimelineValue}
            setFilterTimeDetailValue={setFilterTimeDetailValue}
            successLoadData={ordersReady && inputTicketsReady}
            typeDashboard="dashboard-profit"
            titleDashboard="THỐNG KÊ LỢI NHUẬN"
            dateDashboardStart={
              tbodyValue.length > 0 ? (tbodyValue[0][1]! as string) : ""
            }
            dateDashboardEnd={
              tbodyValue.length > 0
                ? (tbodyValue[tbodyValue.length - 1][2]! as string)
                : ""
            }
            titlePrint="TKLOINHUAN"
          />
        </div>
        <div className="main__chart dashboard-profit">
          <CustomLineChart
            id={lineChartId}
            profitLineValue={profitLineValue}
            revenueLineValue={revenueLineValue}
            expenseLineValue={expenseLineValue}
            xLabelsValue={xLabelsValue}
          />
        </div>
        <div className="main__table dashboard">
          <CustomTableDashboard
            id={tableDataId}
            className="profit"
            columnsWidth={columnsWidthValue}
            columnsTitle={columnsTitleValue}
            format={formatValue}
            tbody={tbodyValue}
            tfoot={tfootValue}
          />
        </div>
      </main>
    </>
  );
};

export default ManagerDashboardProfitPage;
