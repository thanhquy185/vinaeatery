import { use, useEffect, useState } from "react";
import { AppleOutlined, FileDoneOutlined, TableOutlined } from "@ant-design/icons";
import type { FoodsFormatType, OrdersFormatType, TablesFormatType, UseTablesFormatType } from "../../../common/types";
import { FoodStatus, OrderStatus, PayStatus, UseTableStatus } from "../../../common/values";
import CustomSegmented from "../../../components/admin/segmented";
import FilterDashboard from "../../../components/admin/filter-dashboard";
import CustomTableDashboard from "../../../components/admin/table-dashboard";
import { FindAllFood, FindAllOrder, FindAllTable, FindAllUseTable } from "../../../services/api";
import { getFilterTimesForDashboard } from "../../../utils/otherEvents";
import { openNotification } from "../../../utils/showNotification";

// Các giá trị chung
const tableDataId = "order-table-data-dashboard-revenue";

// Các chuỗi để lấy được biểu đồ, bảng dữ liệu thông qua css selector
export const tableDataQueryDashboardRevenue = `#${tableDataId}`;

// Cấu hình chung
// -
type SegmentKey = "orders" | "foods" | "tables";
// - Kích thước bảng dữ liệu
const columnsWidthType: Record<SegmentKey, string[]> = {
  orders: ["10%", "10%", "10%", "22%", "22%", "26%"],
  foods: ["30%", "22%", "22%", "26%"],
  tables: ["30%", "22%", "22%", "26%"]
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
  tables: ["Bàn ăn", "Tổng số đơn", "Tổng số món ăn", "Doanh thu"]
};
// - Định dạng bảng dữ liệu
const formatsType: Record<SegmentKey, string[]> = {
  orders: ["", "", "", "", "", "price"],
  foods: ["info", "price", "", "price"],
  tables: ["info", "", "", "price"],
};

// Admin Dashboard Revenue Page
const AdminDashboardRevenuePage = () => {
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
  const [filterTimelineValue, setFilterTimelineValue] = useState<
    string | null
  >(null);
  // - Thời gian cụ thể
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string | null
  >(null);

  // Các biến giữ giá trị cho việc thống kê theo bảng dữ liệu
  const [dateDashboardStart, setDateDashboardStart] = useState<string>();
  const [dateDashboardEnd, setDateDashboardEnd] = useState<string>();
  const [tbodyValue, setTbodyValue] = useState<(string | number)[][]>([]);
  const [tfootValue, setTfootValue] = useState<(string | number)[]>([]);

  // Hàm cập nhật danh sách các đơn món ăn, món ăn, bàn ăn (gọi API)
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
      statusValue: [UseTableStatus.occupied]!
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
      const times = getFilterTimesForDashboard(filterTimelineValue, filterTimeDetailValue);
      if (times) {
        // Ngày bắt đầu và kết thúc của thống kê
        const dateDashboardStartTemp = times[0].start;
        const dateDashboardEndTemp = times[times.length - 1].end;

        // Cập nhật ngày thống kê
        setDateDashboardStart(dateDashboardStartTemp);
        setDateDashboardEnd(dateDashboardEndTemp);

        // Bảng dữ liệu thống kê theo đơn món ăn
        if (segmentedValue === segmentedOptions[0].label) {
          let newTbodyValue: (string | number)[][] = [], newTotalOrderValue: number = 0,
            newTotalQuantityValue: number = 0, newTotalRevenueValue: number = 0;
          times?.forEach((time, index) => {
            // - Tổng đơn món ăn
            const totalOrderValue = orders.reduce(
              (total, order) => {
                const dateCreate = order.timeCreate?.split(" ")[0]!;
                if (dateCreate >= time.start && dateCreate <= time.end) {
                  return total + 1;
                }

                return total;
              },
              0
            );

            // - Tổng số món ăn
            const totalQuantityValue = orders.reduce(
              (total, order) => {
                const dateCreate = order.timeCreate?.split(" ")[0]!;
                if (dateCreate >= time.start && dateCreate <= time.end) {
                  const totalQuantity = order.orderDetails?.reduce((quantity, orderDetails) => {
                    return quantity + orderDetails.quantity;
                  }, 0)

                  return total + (totalQuantity || 0);
                }

                return total;
              },
              0
            );

            // - Doanh thu
            const totalRevenueValue = orders.reduce(
              (total, order) => {
                const dateCreate = order.timeCreate?.split(" ")[0]!;
                if (dateCreate >= time.start && dateCreate <= time.end) {
                  return total + (order.totalPrice || 0);
                }

                return total;
              },
              0
            );

            // -
            newTbodyValue.push(
              [index + 1, time.start, time.end, totalOrderValue, totalQuantityValue, totalRevenueValue]
            )
            newTotalOrderValue += totalOrderValue;
            newTotalQuantityValue += totalQuantityValue;
            newTotalRevenueValue += totalRevenueValue;
          });

          setTbodyValue(newTbodyValue);
          setTfootValue([newTotalOrderValue, newTotalQuantityValue, newTotalRevenueValue]);
        }
        // Bảng dữ liệu thống kê theo món ăn 
        if (segmentedValue === segmentedOptions[1].label) {
          let newTbodyValue: (string | number)[][] = [], newTotalFoodPriceValue: number = 0,
            newTotalFoodQuantityValue: number = 0, newTotalRevenueValue: number = 0;
          if (dateDashboardStartTemp && dateDashboardEndTemp) {
            foods?.forEach((food) => {
              // - Thông tin cơ bản
              const foodInfo = "#" + food!.id! + " - " + food!.name! + " - " + food!.categoryFood?.name! + " - " + food!.status;

              // - Giá bán
              const foodPrice = food!.price || 0;

              // - Tổng số lượng bán
              const quantityValue = orders.reduce(
                (total, order) => {
                  const dateCreate = order.timeCreate?.split(" ")[0]!;
                  if (dateCreate >= dateDashboardStartTemp && dateCreate <= dateDashboardEndTemp) {
                    const totalQuantity = order.orderDetails?.reduce((quantity, orderDetails) => {
                      if (orderDetails!.food.id === food!.id) {
                        return quantity + orderDetails.quantity;
                      }

                      return quantity;
                    }, 0)

                    return total + (totalQuantity || 0);
                  }

                  return total;
                },
                0
              );

              // - Doanh thu
              const totalRevenueValue = foodPrice * quantityValue;

              //
              newTbodyValue.push([foodInfo, foodPrice, quantityValue, totalRevenueValue]);
              newTotalFoodPriceValue += foodPrice;
              newTotalFoodQuantityValue += quantityValue;
              newTotalRevenueValue += totalRevenueValue;
            })
          }

          setTbodyValue(newTbodyValue);
          setTfootValue([newTotalFoodPriceValue, newTotalFoodQuantityValue, newTotalRevenueValue]);
        }
        // Bảng dữ liệu thống kê theo bàn ăn
        if (segmentedValue === segmentedOptions[2].label) {
          let newTbodyValue: (string | number)[][] = [], newTotalOrderValue: number = 0,
            newTotalQuantityValue: number = 0, newTotalRevenueValue: number = 0;
          tables?.forEach((table) => {
            // - Thông tin cơ bản
            const tableInfo = "#" + table!.id! + " - " + table!.name! + " - "
              + table!.categoryTable?.name! + " - " + table!.floor?.name + " - "
              + table!.status;

            // - Tổng số đơn món ăn
            const totalOrderValue = useTables?.reduce((total, useTable) => {
              const dateStart = useTable.timeStart?.split(" ")[0]!;
              const dateEnd = useTable.timeEnd?.split(" ")[0]!;
              if (useTable.table?.id === table.id && dateStart >= dateDashboardStartTemp
                && dateStart <= dateDashboardEndTemp && dateEnd >= dateDashboardStartTemp
                && dateEnd <= dateDashboardEndTemp) {
                return total + 1;
              }

              return total;
            }, 0)

            // - Tổng số món ăn
            const totalQuantityValue = useTables?.reduce((total, useTable) => {
              const dateStart = useTable.timeStart?.split(" ")[0]!;
              const dateEnd = useTable.timeEnd?.split(" ")[0]!;
              if (useTable.table?.id === table.id && dateStart >= dateDashboardStartTemp
                && dateStart <= dateDashboardEndTemp && dateEnd >= dateDashboardStartTemp
                && dateEnd <= dateDashboardEndTemp) {
                const quantityValue = useTable.order?.orderDetails?.reduce((quantity, orderDetail) => {
                  return quantity + (orderDetail.quantity || 0);
                }, 0)

                return quantityValue || 0;
              }

              return total;
            }, 0)

            // - Doanh thu
            const totalRevenueValue = useTables?.reduce((total, useTable) => {
              const dateStart = useTable.timeStart?.split(" ")[0]!;
              const dateEnd = useTable.timeEnd?.split(" ")[0]!;
              if (useTable.table?.id === table.id && dateStart >= dateDashboardStartTemp
                && dateStart <= dateDashboardEndTemp && dateEnd >= dateDashboardStartTemp
                && dateEnd <= dateDashboardEndTemp) {
                return useTable.order?.totalPrice || 0;
              }

              return total;
            }, 0)

            //
            newTbodyValue.push([tableInfo, totalOrderValue, totalQuantityValue, totalRevenueValue]);
            newTotalOrderValue += totalOrderValue;
            newTotalQuantityValue += totalQuantityValue;
            newTotalRevenueValue += totalRevenueValue;
          })

          setTbodyValue(newTbodyValue);
          setTfootValue([newTotalOrderValue, newTotalQuantityValue, newTotalRevenueValue]);
        }
      }
    } else {
      setTbodyValue([]);
      setTfootValue([]);
    }
  }, [segmentedValue, filterTimelineValue, filterTimeDetailValue])

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Thống kê - Thống kê Doanh thu</h2>
        </div>
        <div className="main__segmented">
          <CustomSegmented
            className="segmented dashboard-profit"
            options={segmentedOptions}
            setSelectedValue={setSegmentedValue}
          />
        </div>
        <div className="main__filter">
          <FilterDashboard
            setFilterTimelineValue={setFilterTimelineValue}
            setFilterTimeDetailValue={setFilterTimeDetailValue}
            successLoadData={ordersReady && foodsReady && tablesReady && useTablesReady}
            typeDashboard="dashboard-revenue"
            titleDashboard="THỐNG KÊ DOANH THU"
            dateDashboardStart={tbodyValue.length > 0 ? dateDashboardStart : ""}
            dateDashboardEnd={tbodyValue.length > 0 ? dateDashboardEnd : ""}
            titlePrint="TKDOANHTHU"
          />
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

export default AdminDashboardRevenuePage;
