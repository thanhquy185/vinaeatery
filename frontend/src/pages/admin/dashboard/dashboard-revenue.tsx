import { useEffect, useState, type JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import type { SelectProps } from "antd";
import { AppleOutlined, FileDoneOutlined } from "@ant-design/icons";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomCardStatic from "../../../components/admin/card-static";
import CustomTableDashboard from "../../../components/admin/table-dashboard";
import { CustomPieChart } from "../../../components/admin/charts";
import CustomSegmented from "../../../components/admin/segmented";

// Cấu hình chung
// -
type SegmentKey = "orders" | "foods";
// - Kích thước bảng dữ liệu
const columnsWidthType: Record<SegmentKey, string[]> = {
  orders: ["10%", "10%", "10%", "22%", "22%", "26%"],
  foods: ["30%", "22%", "22%", "26%"],
};
// - Tiêu đề bảng dữ liệu
const columnsTitleType: Record<SegmentKey, string[]> = {
  orders: [
    "Tháng",
    "Từ ngày",
    "Đến ngày",
    "Số đơn món ăn",
    "Tổng món ăn",
    "Doanh thu",
  ],
  foods: ["Món ăn", "Số đơn món ăn", "Số lượng bán", "Doanh thu"],
};

// Admin Dashboard Revenue Page
const AdminDashboardRevenuePage = () => {
  // Các giữ giá trị của thành phần được chọn
  const segmentedOptions = [
    { label: "Đơn món ăn", value: "Đơn món ăn", icon: <FileDoneOutlined /> },
    { label: "Món ăn", value: "Món ăn", icon: <AppleOutlined /> },
  ];
  const convertSegmentedValue: { [x: string]: SegmentKey } = {
    [segmentedOptions[0].label]: "orders",
    [segmentedOptions[1].label]: "foods",
  };
  const [segmentedValue, setSegmentedValue] = useState<string>(
    segmentedOptions[0].label
  );

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Mốc thời gian
  const timelineLabel = "Chọn Mốc thời gian";
  const timelineOptions: SelectProps["options"] = [
    { label: "Theo năm", value: "Theo năm" },
    { label: "Theo quý", value: "Theo quý" },
    { label: "Theo tháng", value: "Theo tháng" },
  ];
  const [filterTimelineValue, setFilterTimelineValue] = useState<
    string[] | null
  >([]);
  // - Thời gian cụ thể
  const timeDetailLabel = "Chọn Thời gian cụ thể";
  const timeDetailOptions: SelectProps["options"] = [
    { label: "Năm 2025", value: "Năm 2025" },
    { label: "Tháng 06/2025", value: "Tháng 06/2025" },
    { label: "Quý 01/2025", value: "Quý 1/2025" },
  ];
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string[] | null
  >([]);

  // Các biến giữ giá trị cho việc hiển thị thông số trên card
  const [totalCardValue, setTotalCardValue] = useState<number>(0);
  const [averageCardValue, setAverageCardValue] = useState<number>(0);
  const [maxCardValue, setMaxCardValue] = useState<number>(0);
  const [minCardValue, setMinCardValue] = useState<number>(0);

  console.log(segmentedValue);

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
          <CustomFindSelect
            mode={undefined}
            placeholder={timelineLabel}
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-timeline"
            options={timelineOptions}
            setFilterSelectValue={setFilterTimelineValue}
          />
          <CustomFindSelect
            mode={undefined}
            placeholder={timeDetailLabel}
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-timeDetail"
            options={timeDetailOptions}
            setFilterSelectValue={setFilterTimeDetailValue}
          />
          <button
            className={"main__filter-button btn create"}
            style={{ width: "18%" }}
          >
            <FontAwesomeIcon icon={faPrint} className="icon" />
            &nbsp;In phiếu thống kê
          </button>
        </div>
        {/* {segmentedValue === "Đơn món ăn" && (
          <div className="main__cards dashboard-revenue">
            <CustomCardStatic
              className="card-1"
              title={"Tổng doanh thu"}
              value={totalCardValue}
              prefix={<DollarCircleOutlined />}
            />
            <CustomCardStatic
              className="card-2"
              title={"Trung bình doanh thu"}
              value={averageCardValue}
              prefix={<PercentageOutlined />}
            />
            <CustomCardStatic
              className="card-3"
              title={"Doanh thu cao nhất (Tuần / Tháng)"}
              value={maxCardValue}
              prefix={<SmileOutlined />}
            />
            <CustomCardStatic
              className="card-4"
              title={"Doanh thu thấp nhất (Tuần / Tháng)"}
              value={minCardValue}
              prefix={<FrownOutlined />}
            />
          </div>
        )} */}
        <div className="main__table dashboard">
          <CustomTableDashboard
            className="revenue"
            columnsWidth={
              columnsWidthType[convertSegmentedValue[segmentedValue]]
            }
            columnsTitle={
              columnsTitleType[convertSegmentedValue[segmentedValue]]
            }
          />
        </div>
      </main>
    </>
  );
};

export default AdminDashboardRevenuePage;
