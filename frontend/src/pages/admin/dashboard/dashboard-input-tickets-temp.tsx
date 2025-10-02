import { useEffect, useState, type JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import type { SelectProps } from "antd";
import {
  AppstoreOutlined,
  DollarCircleOutlined,
  FrownOutlined,
  PercentageOutlined,
  ReconciliationOutlined,
  SmallDashOutlined,
  SmileOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomCardStatic from "../../../components/admin/card-static";
import CustomTableDashboard from "../../../components/admin/table-dashboard";
import { CustomPieChart } from "../../../components/admin/charts";
import CustomSegmented from "../../../components/admin/segmented";

// Cấu hình chung
// -
type SegmentKey = "overview" | "salary" | "ingredients" | "others";
// - Kích thước bảng dữ liệu
const columnsWidthType: Record<SegmentKey, string[]> = {
  overview: ["10%", "10%", "10%", "17%", "17%", "17%", "19%"],
  salary: ["40%", "30%", "30%"],
  ingredients: ["10%", "10%", "10%", "22%", "22%", "26%"],
  others: [],
};
// - Tiêu đề bảng dữ liệu
const columnsTitleType: Record<SegmentKey, string[]> = {
  overview: [
    "Tháng",
    "Từ ngày",
    "Đến ngày",
    "Tiền lương",
    "Nguyên liệu",
    "Phí khác",
    "Chi tiêu",
  ],
  salary: ["Nhân viên", "Lương cơ bản", "Lương nhận được"],
  ingredients: [
    "Tháng",
    "Từ ngày",
    "Đến ngày",
    "Số phiếu nhập",
    "Tổng nguyên liệu",
    "Chi tiêu",
  ],
  others: [],
};

// Admin Dashboard Input Tickets Page
const AdminDashboardInputTicketsPageTemp = () => {
  // Các giữ giá trị của thành phần được chọn
  const segmentedOptions = [
    { label: "Tổng quan", value: "Tổng quan", icon: <AppstoreOutlined /> },
    { label: "Tiền lương", value: "Tiền lương", icon: <SolutionOutlined /> },
    {
      label: "Nguyên liệu",
      value: "Nguyên liệu",
      icon: <ReconciliationOutlined />,
    },
    { label: "Phí khác", value: "Phí khác", icon: <SmallDashOutlined /> },
  ];
  const convertSegmentedValue: { [x: string]: SegmentKey } = {
    [segmentedOptions[0].label]: "overview",
    [segmentedOptions[1].label]: "salary",
    [segmentedOptions[2].label]: "ingredients",
    [segmentedOptions[3].label]: "others",
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

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Thống kê Chi tiêu</h2>
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
        {segmentedValue === "Tổng quan" && (
          <div className="main__chart split-2">
            <div className="main__chart-card">
              <CustomCardStatic
                className="card-1"
                title={"Tổng chi tiêu"}
                value={totalCardValue}
                prefix={<DollarCircleOutlined />}
              />
              <CustomCardStatic
                className="card-2"
                title={"Trung bình chi tiêu"}
                value={averageCardValue}
                prefix={<PercentageOutlined />}
              />
              <CustomCardStatic
                className="card-3"
                title={"Chi tiêu cao nhất (Tuần / Tháng)"}
                value={maxCardValue}
                prefix={<SmileOutlined />}
              />
              <CustomCardStatic
                className="card-4"
                title={"Chi tiêu thấp nhất (Tuần / Tháng)"}
                value={minCardValue}
                prefix={<FrownOutlined />}
              />
            </div>
            <CustomPieChart />
          </div>
        )}
        <div className="main__table dashboard">
          <CustomTableDashboard
            className="expense"
            columnsWidth={
              columnsWidthType[convertSegmentedValue[segmentedValue]]
            }
            columnsTitle={
              columnsTitleType[convertSegmentedValue[segmentedValue]]
            }
            tbody={
              segmentedValue == "Tổng quan"
                ? [
                    ["1", "2025-06-24", "2025-06-24", 1, 1, 1, 1],
                    ["2", "2025-06-25", "2025-06-25", 2, 2, 2, 2],
                  ]
                : segmentedValue == "Tiền lương"
                ? [
                    ["#1234567890 - Trần Thanh Quy", 1000000, 1000000],
                    ["#0987654321 - TRẦN THANH QUY", 2000000, 2000000],
                  ]
                : segmentedValue == "Nguyên liệu"
                ? [
                    ["1", "2025-06-24", "2025-06-24", 100000, 50, 50000],
                    ["1", "2025-06-24", "2025-06-24", 100000, 40, 40000],
                  ]
                : []
            }
            tfoot={
              segmentedValue == "Tổng quan"
                ? [3, 3, 3, 3]
                : segmentedValue == "Tiền lương"
                ? [2000000, 2000000]
                : segmentedValue == "Nguyên liệu"
                ? [200000, 90, 90000]
                : []
            }
            format={
              segmentedValue == "Tổng quan"
                ? ["", "", "", "price", "price", "price", "price"]
                : segmentedValue == "Tiền lương"
                ? ["info", "price", "price"]
                : segmentedValue == "Nguyên liệu"
                ? ["", "", "", "", "", "price"]
                : []
            }
          />
        </div>
      </main>
    </>
  );
};

export default AdminDashboardInputTicketsPageTemp;
