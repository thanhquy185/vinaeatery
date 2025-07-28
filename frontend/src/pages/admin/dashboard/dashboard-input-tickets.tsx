import { useEffect, useState, type JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import type { SelectProps } from "antd";
import {
  AppstoreOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FrownOutlined,
  GoldOutlined,
  PercentageOutlined,
  ReconciliationOutlined,
  SmallDashOutlined,
  SmileOutlined,
  SolutionOutlined,
  TagOutlined,
} from "@ant-design/icons";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomCardStatic from "../../../components/admin/card-static";
import CustomTableDashboard from "../../../components/admin/table-dashboard";
import { CustomPieChart } from "../../../components/admin/charts";
import CustomSegmented from "../../../components/admin/segmented";
import FilterDashboard from "../../../components/admin/filter-dashboard";
import type {
  IngredientsFormatType,
  InputTicketsFormatType,
  SuppliersType,
} from "../../../common/types";
import { InputTicketStatus, PayStatus } from "../../../common/values";
import {
  FindAllIngredient,
  FindAllInputTicket,
  FindAllSupplier,
} from "../../../services/api";
import { openNotification } from "../../../utils/showNotification";
import { getFilterTimesForDashboard } from "../../../utils/otherEvents";

// Các giá trị chung
const tableDataId = "table-data-dashboard-input-tickets";

// Các chuỗi để lấy được biểu đồ, bảng dữ liệu thông qua css selector
export const tableDataQueryDashboardInputTickets = `#${tableDataId}`;

// Cấu hình chung
// -
type SegmentKey = "input-tickets" | "ingredients" | "suppliers";
// - Kích thước bảng dữ liệu
const columnsWidthType: Record<SegmentKey, string[]> = {
  "input-tickets": ["10%", "10%", "10%", "22%", "22%", "26%"],
  ingredients: ["30%", "22%", "22%", "26%"],
  suppliers: ["30%", "22%", "22%", "26%"],
};
// - Tiêu đề bảng dữ liệu
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
// - Định dạng bảng dữ liệu
const formatsType: Record<SegmentKey, string[]> = {
  "input-tickets": ["", "", "", "", "", "price"],
  ingredients: ["info", "price", "", "price"],
  suppliers: ["info", "", "", "price"],
};

// Admin Dashboard Input Tickets Page
const AdminDashboardInputTicketsPage = () => {
  // Các thành phần giữ giá trị cho việc hiển thị bảng thống kê
  const [inputTickets, setInputTickets] = useState<InputTicketsFormatType[]>(
    []
  );
  const [ingredients, setIngredients] = useState<IngredientsFormatType[]>([]);
  const [suppliers, setSuppliers] = useState<SuppliersType[]>([]);

  // Các biến giữ giá trị để biết khi nào dữ liệu đã load xong
  const [inputTicketsReady, setInputTicketsReady] = useState<boolean>(false);
  const [ingredientsReady, setIngredientsReady] = useState<boolean>(false);
  const [suppliersReady, setSuppliersReady] = useState<boolean>(false);

  // Các giữ giá trị của thành phần được chọn
  const segmentedOptions = [
    { label: "Phiếu nhập", value: "Phiếu nhập", icon: <FileDoneOutlined /> },
    { label: "Nguyên liệu", value: "Nguyên liệu", icon: <GoldOutlined /> },
    { label: "Nhà cung cấp", value: "Nhà cung cấp", icon: <TagOutlined /> },
  ];
  const convertSegmentedValue: { [x: string]: SegmentKey } = {
    [segmentedOptions[0].label]: "input-tickets",
    [segmentedOptions[1].label]: "ingredients",
    [segmentedOptions[2].label]: "suppliers",
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

  // Các biến giữ giá trị cho việc thống kê theo bảng dữ liệu
  const [dateDashboardStart, setDateDashboardStart] = useState<string>();
  const [dateDashboardEnd, setDateDashboardEnd] = useState<string>();
  const [tbodyValue, setTbodyValue] = useState<(string | number)[][]>([]);
  const [tfootValue, setTfootValue] = useState<(string | number)[]>([]);

  // Hàm cập nhật danh sách các phiếu nhập, nguyên liệu và nhà cung cấp (gọi API)
  const getAllInputTicket = async () => {
    const res = await FindAllInputTicket({
      statusValue: [InputTicketStatus.confirm, PayStatus.pay],
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
  const getAllIngredient = async () => {
    const res = await FindAllIngredient({});
    if (res!.status === 200) {
      setIngredients(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  const getAllSupplier = async () => {
    const res = await FindAllSupplier({});
    if (res!.status === 200) {
      setSuppliers(res!.data);
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
    getAllInputTicket().finally(() => setInputTicketsReady(true));
    getAllIngredient().finally(() => setIngredientsReady(true));
    getAllSupplier().finally(() => setSuppliersReady(true));
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

        // Bảng dữ liệu thống kê theo phiếu nhập
        if (segmentedValue === segmentedOptions[0].label) {
          let newTbodyValue: (string | number)[][] = [],
            newTotalTicketValue: number = 0,
            newTotalQuantityValue: number = 0,
            newTotalExpenseValue: number = 0;
          times?.forEach((time, index) => {
            // - Tổng phiếu nhập
            const totalTicketValue = inputTickets.reduce(
              (total, inputTicket) => {
                const dateCreate = inputTicket.timeCreate?.split(" ")[0]!;
                console.log(dateCreate);
                if (dateCreate >= time.start && dateCreate <= time.end) {
                  return total + 1;
                }

                return total;
              },
              0
            );

            // - Tổng số nguyên liệu
            const totalQuantityValue = inputTickets.reduce(
              (total, inputTicket) => {
                const dateCreate = inputTicket.timeCreate?.split(" ")[0]!;
                if (dateCreate >= time.start && dateCreate <= time.end) {
                  const totalQuantity = inputTicket.inputTicketDetails?.reduce(
                    (quantity, inputTicketDetails) => {
                      return quantity + inputTicketDetails.quantity;
                    },
                    0
                  );

                  return total + (totalQuantity || 0);
                }

                return total;
              },
              0
            );

            // - Chi tiêu
            const totalExpenseValue = inputTickets.reduce(
              (total, inputTicket) => {
                const dateCreate = inputTicket.timeCreate?.split(" ")[0]!;
                if (dateCreate >= time.start && dateCreate <= time.end) {
                  return total + (inputTicket.totalPrice || 0);
                }

                return total;
              },
              0
            );

            // -
            newTbodyValue.push([
              index + 1,
              time.start,
              time.end,
              totalTicketValue,
              totalQuantityValue,
              totalExpenseValue,
            ]);
            newTotalTicketValue += totalTicketValue;
            newTotalQuantityValue += totalQuantityValue;
            newTotalExpenseValue += totalExpenseValue;
          });

          setTbodyValue(newTbodyValue);
          setTfootValue([
            newTotalTicketValue,
            newTotalQuantityValue,
            newTotalExpenseValue,
          ]);
        }
        // Bảng dữ liệu thống kê theo nguyên liệu
        if (segmentedValue === segmentedOptions[1].label) {
          let newTbodyValue: (string | number)[][] = [],
            newTotalIngredientPriceValue: number = 0,
            newTotalIngredientQuantityValue: number = 0,
            newTotalExpenseValue: number = 0;
          if (dateDashboardStartTemp && dateDashboardEndTemp) {
            ingredients?.forEach((ingredient) => {
              // - Thông tin cơ bản
              const ingredientInfo =
                "#" +
                ingredient!.id! +
                " - " +
                ingredient!.name! +
                " - " +
                ingredient!.categoryIngredient?.name! +
                " - " +
                ingredient!.status;

              // - Giá nhập
              const ingredientPrice = ingredient!.inputPrice || 0;

              // - Tổng số lượng nhập
              const quantityValue = inputTickets.reduce(
                (total, inputTicket) => {
                  const dateCreate = inputTicket.timeCreate?.split(" ")[0]!;
                  if (
                    dateCreate >= dateDashboardStartTemp &&
                    dateCreate <= dateDashboardEndTemp
                  ) {
                    const totalQuantity =
                      inputTicket.inputTicketDetails?.reduce(
                        (quantity, inputTicketDetails) => {
                          if (
                            inputTicketDetails!.ingredient.id === ingredient!.id
                          ) {
                            return quantity + inputTicketDetails.quantity;
                          }

                          return quantity;
                        },
                        0
                      );

                    return total + (totalQuantity || 0);
                  }

                  return total;
                },
                0
              );

              // - Chi tiêu
              const totalExpenseValue = ingredientPrice * quantityValue;

              //
              newTbodyValue.push([
                ingredientInfo,
                ingredientPrice,
                quantityValue,
                totalExpenseValue,
              ]);
              newTotalIngredientPriceValue += ingredientPrice;
              newTotalIngredientQuantityValue += quantityValue;
              newTotalExpenseValue += totalExpenseValue;
            });
          }

          setTbodyValue(newTbodyValue);
          setTfootValue([
            newTotalIngredientPriceValue,
            newTotalIngredientQuantityValue,
            newTotalExpenseValue,
          ]);
        }
        // Bảng dữ liệu thống kê theo nhà cung cấp
        if (segmentedValue === segmentedOptions[2].label) {
          let newTbodyValue: (string | number)[][] = [],
            newTotalTicketValue: number = 0,
            newTotalQuantityValue: number = 0,
            newTotalExpenseValue: number = 0;
          suppliers?.forEach((supplier) => {
            // - Thông tin cơ bản
            const supplierInfo =
              "#" +
              supplier!.id! +
              " - " +
              supplier!.name! +
              " - " +
              supplier!.phone! +
              " - " +
              supplier!.email! +
              " - " +
              supplier!.status;

            // - Tổng số phiếu nhập
            const totalTicketValue = inputTickets?.reduce(
              (total, inputTicket) => {
                const dateCreate = inputTicket.timeCreate?.split(" ")[0]!;
                if (
                  inputTicket.supplier?.id === supplier.id &&
                  dateCreate >= dateDashboardStartTemp &&
                  dateCreate <= dateDashboardEndTemp
                ) {
                  return total + 1;
                }

                return total;
              },
              0
            );

            // - Tổng số nguyên liệu
            const totalQuantityValue = inputTickets?.reduce(
              (total, inputTicket) => {
                const dateCreate = inputTicket.timeCreate?.split(" ")[0]!;
                if (
                  inputTicket.supplier?.id === supplier.id &&
                  dateCreate >= dateDashboardStartTemp &&
                  dateCreate <= dateDashboardEndTemp
                ) {
                  const quantityValue = inputTicket.inputTicketDetails?.reduce(
                    (quantity, inputTicketDetail) => {
                      return quantity + (inputTicketDetail.quantity || 0);
                    },
                    0
                  );

                  return quantityValue || 0;
                }

                return total;
              },
              0
            );

            // - Chi tiêu
            const totalExpenseValue = inputTickets?.reduce(
              (total, inputTicket) => {
                const dateCreate = inputTicket.timeCreate?.split(" ")[0]!;
                if (
                  inputTicket.supplier?.id === supplier.id &&
                  dateCreate >= dateDashboardStartTemp &&
                  dateCreate <= dateDashboardEndTemp
                ) {
                  return inputTicket?.totalPrice || 0;
                }

                return total;
              },
              0
            );

            //
            newTbodyValue.push([
              supplierInfo,
              totalTicketValue,
              totalQuantityValue,
              totalExpenseValue,
            ]);
            newTotalTicketValue += totalTicketValue;
            newTotalQuantityValue += totalQuantityValue;
            newTotalExpenseValue += totalExpenseValue;
          });

          setTbodyValue(newTbodyValue);
          setTfootValue([
            newTotalTicketValue,
            newTotalQuantityValue,
            newTotalExpenseValue,
          ]);
        }
      }
    } else {
      setTbodyValue([]);
      setTfootValue([]);
    }
  }, [segmentedValue, filterTimelineValue, filterTimeDetailValue]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Thống kê - Thống kê Phiếu nhập</h2>
        </div>
        <div className="main__segmented">
          <CustomSegmented
            className="segmented dashboard-input-tickets"
            options={segmentedOptions}
            setSelectedValue={setSegmentedValue}
          />
        </div>
        <div className="main__filter">
          <FilterDashboard
            setFilterTimelineValue={setFilterTimelineValue}
            setFilterTimeDetailValue={setFilterTimeDetailValue}
            successLoadData={inputTicketsReady}
            typeDashboard="dashboard-input-tickets"
            titleDashboard="THỐNG KÊ PHIẾU NHẬP"
            dateDashboardStart={tbodyValue.length > 0 ? dateDashboardStart : ""}
            dateDashboardEnd={tbodyValue.length > 0 ? dateDashboardEnd : ""}
            titlePrint="TKPHIEUNHAP"
          />
        </div>
        <div className="main__table dashboard">
          <CustomTableDashboard
            id={tableDataId}
            className="expense"
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

export default AdminDashboardInputTicketsPage;
