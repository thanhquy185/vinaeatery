import { useEffect, useState } from "react";
import {
  AppleOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FrownOutlined,
  PercentageOutlined,
  SmileOutlined,
  TableOutlined,
} from "@ant-design/icons";
import type {
  FoodsFormatType,
  OrdersFormatType,
  TablesFormatType,
  UseTablesFormatType,
} from "../../../common/types";
import type { PieChartProps } from "../../../common/props";
import {
  FoodStatus,
  OrderStatus,
  PayStatus,
  UseTableStatus,
} from "../../../common/values";
import CustomSegmented from "../../../components/admin/segmented";
import FilterDashboard from "../../../components/admin/filter-dashboard";
import CustomCardStatic from "../../../components/admin/card-static";
import { CustomBarChart, CustomPieChart } from "../../../components/admin/charts";
import CustomTableDashboard from "../../../components/admin/table-dashboard";
import {
  FindAllFood,
  FindAllOrder,
  FindAllTable,
  FindAllUseTable,
} from "../../../services/api";
import { getFilterTimesForDashboard } from "../../../utils/otherEvents";
import { openNotification } from "../../../utils/showNotification";

// Các giá trị chung
const cardsId = "cards-dashboard-orders";
const chartId = "chart-dashboard-orders";
const tableDataId = "table-data-dashboard-orders";

// Các chuỗi để lấy được biểu đồ, bảng dữ liệu thông qua css selector
export const cardsQueryDashboardOrders = `#${cardsId}`;
export const chartQueryDashboardOrders = `div[class*='MuiChartsWrapper-root']:has(#${chartId})`;
export const tableDataQueryDashboardOrders = `#${tableDataId}`;

// Cấu hình chung
// -
type SegmentKey = "orders" | "foods" | "tables";
// - Kích thước bảng dữ liệu
const columnsWidthType: Record<SegmentKey, string[]> = {
  orders: ["10%", "10%", "10%", "22%", "22%", "26%"],
  foods: ["30%", "22%", "22%", "26%"],
  tables: ["30%", "22%", "22%", "26%"],
};
// - Tiêu đề bảng dữ liệu
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
// - Định dạng bảng dữ liệu
const formatsType: Record<SegmentKey, string[]> = {
  orders: ["", "", "", "", "", "price"],
  foods: ["info", "price", "", "price"],
  tables: ["info", "", "", "price"],
};

// Admin Dashboard Orders Page
const AdminDashboardOrdersPage = () => {
  // Các thành phần giữ giá trị cho việc hiển thị bảng thống kê
  const [orders, setOrders] = useState<OrdersFormatType[]>([]);
  const [foods, setFoods] = useState<FoodsFormatType[]>([]);
  const [tables, setTables] = useState<TablesFormatType[]>([]);
  const [useTables, setUseTables] = useState<UseTablesFormatType[]>([]);

  // Các biến giữ giá trị để biết khi nào dữ liệu đã load xong
  const [ordersReady, setOrdersReady] = useState<boolean>(false);
  const [foodsReady, setFoodsReady] = useState<boolean>(false);
  const [tablesReady, setTablesReady] = useState<boolean>(false);
  const [useTablesReady, setUseTablesReady] = useState<boolean>(false);

  // Các giữ giá trị của thành phần được chọn
  const segmentedOptions = [
    { label: "Đơn món ăn", value: "Đơn món ăn", icon: <FileDoneOutlined /> },
    { label: "Món ăn", value: "Món ăn", icon: <AppleOutlined /> },
    { label: "Bàn ăn", value: "Bàn ăn", icon: <TableOutlined /> },
  ];
  const convertSegmentedValue: { [x: string]: SegmentKey } = {
    [segmentedOptions[0].label]: "orders",
    [segmentedOptions[1].label]: "foods",
    [segmentedOptions[2].label]: "tables",
  };
  const [segmentedValue, setSegmentedValue] = useState<string>(
    segmentedOptions[0].label
  );

  // Các biến giữ giá trị từ việc lọc thông tin
  const [filterTimelineValue, setFilterTimelineValue] = useState<string | null>(
    null
  );
  // - Thời gian cụ thể
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string | null
  >(null);

  // Các biến giữ giá trị cho việc hiển thị thông số trên card
  const [totalCardValue, setTotalCardValue] = useState<number>(0);
  const [averageCardValue, setAverageCardValue] = useState<number>(0);
  const [maxCardValue, setMaxCardValue] = useState<number>(0);
  const [minCardValue, setMinCardValue] = useState<number>(0);

  // Các biến giữ giá trị cho việc thống kê theo biểu đồ cột
  const [xAxisLabelValue, setXAxisLabelValue] = useState<string>("");
  const [xAxisDataValue, setXAxisDataValue] = useState<string[]>([]);
  const [seriesLabelValue, setSeriesLabelValue] = useState<string>("");
  const [seriesDataValue, setSeriesDataValue] = useState<number[]>([]);

  // Các biến giữ giá trị cho việc thống kê theo biểu đồ tròn
  const [dataValue, setDataValue] = useState<PieChartProps[]>([]);

  // Các biến giữ giá trị cho việc thống kê theo bảng dữ liệu
  const [dateDashboardStart, setDateDashboardStart] = useState<string>();
  const [dateDashboardEnd, setDateDashboardEnd] = useState<string>();
  const [tbodyValue, setTbodyValue] = useState<(string | number)[][]>([]);
  const [tfootValue, setTfootValue] = useState<(string | number)[]>([]);

  // Hàm cập nhật lại các biến giữ giá trị cho việc thống kê
  const restDataDashboard = () => {
    // - Card tóm tắt
    setTotalCardValue(0);
    setAverageCardValue(0);
    setMaxCardValue(0);
    setMinCardValue(0);

    // - Biểu đồ cột
    setXAxisLabelValue("");
    setXAxisDataValue([]);
    setSeriesLabelValue("");
    setSeriesDataValue([]);

    // Biểu đồ tròn
    setDataValue([]);

    // Bảng dữ liệu
    setTbodyValue([]);
    setTfootValue([]);
  }
  // Hàm cập nhật danh sách các đơn món ăn, món ăn, bàn ăn và sử dụng bàn ăn (gọi API)
  const getAllOrder = async () => {
    const res = await FindAllOrder({
      statusValue: [OrderStatus.confirm, PayStatus.pay],
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
  const getAllFood = async () => {
    const res = await FindAllFood({});
    if (res!.status === 200) {
      setFoods(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  const getAllTable = async () => {
    const res = await FindAllTable({});
    if (res!.status === 200) {
      setTables(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  const getAllUseTable = async () => {
    const res = await FindAllUseTable({
      statusValue: [UseTableStatus.occupied]!,
    });
    if (res!.status === 200) {
      setUseTables(res!.data);
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
    getAllFood().finally(() => setFoodsReady(true));
    getAllTable().finally(() => setTablesReady(true));
    getAllUseTable().finally(() => setUseTablesReady(true));
  }, []);
  //
  useEffect(() => {
    if (segmentedValue && filterTimelineValue && filterTimeDetailValue) {
      const times = getFilterTimesForDashboard(
        filterTimelineValue,
        filterTimeDetailValue
      );
      if (times) {
        // Ngày bắt đầu và kết thúc của thống kê
        const dateDashboardStartTemp = times[0].start;
        const dateDashboardEndTemp = times[times.length - 1].end;

        // Cập nhật ngày thống kê
        setDateDashboardStart(dateDashboardStartTemp);
        setDateDashboardEnd(dateDashboardEndTemp);

        // Bảng dữ liệu thống kê theo đơn món ăn
        if (segmentedValue === segmentedOptions[0].label) {
          let newXAxisDataValue: string[] = [],
            newSeriesDataValue: number[] = [],
            newTbodyValue: (string | number)[][] = [],
            newTotalOrderValue: number = 0,
            newTotalQuantityValue: number = 0,
            newMaxRevenueValue: number = 0,
            newMinRevenueValue: number = 0,
            newTotalRevenueValue: number = 0;
          times?.forEach((time, index) => {
            // - Tổng đơn món ăn
            const totalOrderValue = orders.reduce((total, order) => {
              const dateCreate = order.timeCreate?.split(" ")[0]!;
              if (dateCreate >= time.start && dateCreate <= time.end) {
                return total + 1;
              }

              return total;
            }, 0);

            // - Tổng số món ăn
            const totalQuantityValue = orders.reduce((total, order) => {
              const dateCreate = order.timeCreate?.split(" ")[0]!;
              if (dateCreate >= time.start && dateCreate <= time.end) {
                const totalQuantity = order.orderDetails?.reduce(
                  (quantity, orderDetails) => {
                    return quantity + orderDetails.quantity;
                  },
                  0
                );

                return total + (totalQuantity || 0);
              }

              return total;
            }, 0);

            // - Doanh thu
            const totalRevenueValue = orders.reduce((total, order) => {
              const dateCreate = order.timeCreate?.split(" ")[0]!;
              if (dateCreate >= time.start && dateCreate <= time.end) {
                return total + (order.totalPrice || 0);
              }

              return total;
            }, 0);

            // - Cập nhất giá trị lớn nhất / nhỏ nhất
            if (totalRevenueValue > newMaxRevenueValue) {
              newMaxRevenueValue = totalRevenueValue;
            } else if (totalRevenueValue < newMinRevenueValue) {
              newMinRevenueValue = totalRevenueValue;
            }
            // - Cập nhật giá trị mới cho các biến của biểu đồ cột
            newXAxisDataValue.push((filterTimelineValue.toLowerCase().includes("năm") ? "Th" : "Tu") + (index + 1));
            newSeriesDataValue.push(totalRevenueValue);
            // - Cập nhật giá trị mới cho các biến của bảng dữ liệu
            newTbodyValue.push([
              index + 1,
              time.start,
              time.end,
              totalOrderValue,
              totalQuantityValue,
              totalRevenueValue,
            ]);
            newTotalOrderValue += totalOrderValue;
            newTotalQuantityValue += totalQuantityValue;
            newTotalRevenueValue += totalRevenueValue;
          });

          // Gán các dữ liệu mới cho các card
          setTotalCardValue(newTotalRevenueValue);
          setAverageCardValue(newTotalRevenueValue / times.length);
          setMaxCardValue(newMaxRevenueValue);
          setMinCardValue(newMinRevenueValue);
          // Gán các dữ liệu mới cho biểu đồ cột
          setXAxisDataValue(newXAxisDataValue);
          setSeriesLabelValue("Doanh thu");
          setSeriesDataValue(newSeriesDataValue);
          // Gán các dữ liệu mới cho bảng dữ liệu
          setTbodyValue(newTbodyValue);
          setTfootValue([
            newTotalOrderValue,
            newTotalQuantityValue,
            newTotalRevenueValue,
          ]);
        }
        // Bảng dữ liệu thống kê theo món ăn
        if (segmentedValue === segmentedOptions[1].label) {
          let categoryFoodIds = "", newDataValue: PieChartProps[] = [],
            newTbodyValue: (string | number)[][] = [],
            newTotalFoodPriceValue: number = 0,
            newTotalFoodQuantityValue: number = 0,
            newMaxRevenueValue: number = 0,
            newMinRevenueValue: number = 0,
            newTotalRevenueValue: number = 0;
          if (dateDashboardStartTemp && dateDashboardEndTemp) {
            foods?.forEach((food) => {
              // - Thông tin cơ bản
              const foodInfo =
                "#" +
                food!.id! +
                " - " +
                food!.name! +
                " - " +
                food!.categoryFood?.name! +
                " - " +
                food!.status;

              // - Giá bán
              const foodPrice = food!.price || 0;

              // - Tổng số lượng bán
              const quantityValue = orders.reduce((total, order) => {
                const dateCreate = order.timeCreate?.split(" ")[0]!;
                if (
                  dateCreate >= dateDashboardStartTemp &&
                  dateCreate <= dateDashboardEndTemp
                ) {
                  const totalQuantity = order.orderDetails?.reduce(
                    (quantity, orderDetails) => {
                      if (orderDetails!.food.id === food!.id) {
                        return quantity + orderDetails.quantity;
                      }

                      return quantity;
                    },
                    0
                  );

                  return total + (totalQuantity || 0);
                }

                return total;
              }, 0);

              // - Doanh thu
              const totalRevenueValue = foodPrice * quantityValue;

              // - Cập nhất giá trị lớn nhất / nhỏ nhất
              if (totalRevenueValue > newMaxRevenueValue) {
                newMaxRevenueValue = totalRevenueValue;
              } else if (totalRevenueValue < newMinRevenueValue) {
                newMinRevenueValue = totalRevenueValue;
              }
              // - Cập nhật các biến chứa dữ liệu mới của biểu đồ tròn
              if (totalRevenueValue > 0) {
                if (categoryFoodIds.includes(food!.categoryFood!.id + "")) {
                  for (let i = 0; i < newDataValue.length; i++) {
                    if (newDataValue[i].id === food!.categoryFood!.id) {
                      newDataValue[i].value += totalRevenueValue;
                    }
                  }
                } else {
                  categoryFoodIds += food!.categoryFood!.id;
                  newDataValue.push(
                    {
                      id: food!.categoryFood!.id!,
                      value: totalRevenueValue,
                      label: food!.categoryFood!.name!
                    }
                  );
                }
              }
              // - Cập nhật các biến chứa dữ liệu mới của bảng dữ liệu
              newTbodyValue.push([
                foodInfo,
                foodPrice,
                quantityValue,
                totalRevenueValue,
              ]);
              newTotalFoodPriceValue += foodPrice;
              newTotalFoodQuantityValue += quantityValue;
              newTotalRevenueValue += totalRevenueValue;
            });
          }

          // Gán các dữ liệu mới cho các card
          setTotalCardValue(newTotalRevenueValue);
          setAverageCardValue(newTotalRevenueValue / foods.length);
          setMaxCardValue(newMaxRevenueValue);
          setMinCardValue(newMinRevenueValue);
          // Gán dữ liệu mới cho biểu đồ tròn
          setDataValue(newDataValue);
          // Gán dữ liệu mới cho bảng dữ liệu
          setTbodyValue(newTbodyValue);
          setTfootValue([
            newTotalFoodPriceValue,
            newTotalFoodQuantityValue,
            newTotalRevenueValue,
          ]);
        }
        // Bảng dữ liệu thống kê theo bàn ăn
        if (segmentedValue === segmentedOptions[2].label) {
          let categoryTableIds = "", newDataValue: PieChartProps[] = [],
            newTbodyValue: (string | number)[][] = [],
            newTotalOrderValue: number = 0,
            newTotalQuantityValue: number = 0,
            newMaxRevenueValue: number = 0,
            newMinRevenueValue: number = 0,
            newTotalRevenueValue: number = 0;
          tables?.forEach((table) => {
            // - Thông tin cơ bản
            const tableInfo =
              "#" +
              table!.id! +
              " - " +
              table!.name! +
              " - " +
              table!.categoryTable?.name! +
              " - " +
              table!.floor?.name +
              " - " +
              table!.status;

            // - Tổng số đơn món ăn
            const totalOrderValue = useTables?.reduce((total, useTable) => {
              const dateStart = useTable.timeStart?.split(" ")[0]!;
              const dateEnd = useTable.timeEnd?.split(" ")[0]!;
              if (
                useTable.table?.id === table.id &&
                dateStart >= dateDashboardStartTemp &&
                dateStart <= dateDashboardEndTemp &&
                dateEnd >= dateDashboardStartTemp &&
                dateEnd <= dateDashboardEndTemp
              ) {
                return total + 1;
              }

              return total;
            }, 0);

            // - Tổng số món ăn
            const totalQuantityValue = useTables?.reduce((total, useTable) => {
              const dateStart = useTable.timeStart?.split(" ")[0]!;
              const dateEnd = useTable.timeEnd?.split(" ")[0]!;
              if (
                useTable.table?.id === table.id &&
                dateStart >= dateDashboardStartTemp &&
                dateStart <= dateDashboardEndTemp &&
                dateEnd >= dateDashboardStartTemp &&
                dateEnd <= dateDashboardEndTemp
              ) {
                const quantityValue = useTable.order?.orderDetails?.reduce(
                  (quantity, orderDetail) => {
                    return quantity + (orderDetail.quantity || 0);
                  },
                  0
                );

                return quantityValue || 0;
              }

              return total;
            }, 0);

            // - Doanh thu
            const totalRevenueValue = useTables?.reduce((total, useTable) => {
              const dateStart = useTable.timeStart?.split(" ")[0]!;
              const dateEnd = useTable.timeEnd?.split(" ")[0]!;
              if (
                useTable.table?.id === table.id &&
                dateStart >= dateDashboardStartTemp &&
                dateStart <= dateDashboardEndTemp &&
                dateEnd >= dateDashboardStartTemp &&
                dateEnd <= dateDashboardEndTemp
              ) {
                return useTable.order?.totalPrice || 0;
              }

              return total;
            }, 0);

            // - Cập nhất giá trị lớn nhất / nhỏ nhất
            if (totalRevenueValue > newMaxRevenueValue) {
              newMaxRevenueValue = totalRevenueValue;
            } else if (totalRevenueValue < newMinRevenueValue) {
              newMinRevenueValue = totalRevenueValue;
            }
            // - Cập nhật các biến chứa dữ liệu mới của biểu đồ tròn
            if (totalRevenueValue > 0) {
              if (categoryTableIds.includes(table!.categoryTable!.id + "")) {
                for (let i = 0; i < newDataValue.length; i++) {
                  if (newDataValue[i].id === table!.categoryTable!.id) {
                    newDataValue[i].value += totalRevenueValue;
                  }
                }
              } else {
                categoryTableIds += table!.categoryTable!.id;
                newDataValue.push(
                  {
                    id: table!.categoryTable!.id!,
                    value: totalRevenueValue,
                    label: table!.categoryTable!.name!
                  }
                );
              }
            }
            // - Cập nhật các biến chứa dữ liệu mới của bảng dữ liệu
            newTbodyValue.push([
              tableInfo,
              totalOrderValue,
              totalQuantityValue,
              totalRevenueValue,
            ]);
            newTotalOrderValue += totalOrderValue;
            newTotalQuantityValue += totalQuantityValue;
            newTotalRevenueValue += totalRevenueValue;
          });

          // Gán các dữ liệu mới cho các card
          setTotalCardValue(newTotalRevenueValue);
          setAverageCardValue(newTotalRevenueValue / tables.length);
          setMaxCardValue(newMaxRevenueValue);
          setMinCardValue(newMinRevenueValue);
          // Gán dữ liệu mới cho biểu đồ tròn
          setDataValue(newDataValue);
          // Gán các dữ liệu mới cho bảng dữ liệu
          setTbodyValue(newTbodyValue);
          setTfootValue([
            newTotalOrderValue,
            newTotalQuantityValue,
            newTotalRevenueValue,
          ]);

          console.log(newDataValue);
        }
      }
    } else {
      restDataDashboard();
    }
  }, [segmentedValue, filterTimelineValue, filterTimeDetailValue]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Thống kê - Thống kê Đơn món ăn</h2>
        </div>
        <div className="main__segmented">
          <CustomSegmented
            className="segmented dashboard-orders"
            options={segmentedOptions}
            setSelectedValue={setSegmentedValue}
          />
        </div>
        <div className="main__filter">
          <FilterDashboard
            setFilterTimelineValue={setFilterTimelineValue}
            setFilterTimeDetailValue={setFilterTimeDetailValue}
            successLoadData={
              ordersReady && foodsReady && tablesReady && useTablesReady
            }
            typeDashboard="dashboard-orders"
            titleDashboard="THỐNG KÊ ĐƠN MÓN ĂN"
            dateDashboardStart={tbodyValue.length > 0 ? dateDashboardStart : ""}
            dateDashboardEnd={tbodyValue.length > 0 ? dateDashboardEnd : ""}
            titlePrint="TKDONMONAN"
          />
        </div>
        <div className="main__chart split-2">
          <div id={cardsId} className="main__chart-card">
            <CustomCardStatic
              className="card-1"
              title={"Tổng doanh thu"}
              value={totalCardValue}
              prefix={<DollarCircleOutlined />}
              separator="."
            />
            <CustomCardStatic
              className="card-2"
              title={"Doanh thu trung bình"}
              value={averageCardValue}
              prefix={<PercentageOutlined />}
              separator="."
            />
            <CustomCardStatic
              className="card-3"
              title={"Doanh thu cao nhất"}
              value={maxCardValue}
              prefix={<SmileOutlined />}
              separator="."
            />
            <CustomCardStatic
              className="card-4"
              title={"Doanh thu thấp nhất"}
              value={minCardValue}
              prefix={<FrownOutlined />}
              separator="."
            />
          </div>
          {
            segmentedValue === segmentedOptions[0].label ? (
              <CustomBarChart
                id={chartId}
                xAxisLabelValue={xAxisLabelValue}
                xAxisDataValue={xAxisDataValue}
                seriesLabelValue={seriesLabelValue}
                seriesDataValue={seriesDataValue}
              />
            ) : (
              <CustomPieChart id={chartId} dataValue={dataValue} />
            )
          }
        </div>
        <div className="main__table dashboard">
          <CustomTableDashboard
            id={tableDataId}
            className="revenue"
            columnsWidth={
              columnsWidthType[convertSegmentedValue[segmentedValue]]
            }
            columnsTitle={
              columnsTitleType[convertSegmentedValue[segmentedValue]]
            }
            format={formatsType[convertSegmentedValue[segmentedValue]]}
            tbody={tbodyValue}
            tfoot={tfootValue}
          />
        </div>
      </main>
    </>
  );
};

export default AdminDashboardOrdersPage;
