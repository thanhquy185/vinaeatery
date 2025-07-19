import { useState } from "react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { SelectProps } from "antd";
import { AppstoreOutlined, VideoCameraOutlined } from "@ant-design/icons";
import CustomSegmented from "../../../components/admin/segmented";
import CustomFindSelect from "../../../components/admin/find-select";
import { CustomLineChart } from "../../../components/admin/charts";
import CustomTableDashboard from "../../../components/admin/table-dashboard";

// Admin Dashboard Profit Page
const AdminDashboardProfitPage = () => {
  // Các giữ giá trị của thành phần được chọn
  const segmentedOptions = [
    { label: "Tổng quan", value: "Tổng quan", icon: <AppstoreOutlined /> },
    { label: "Phim", value: "Phim", icon: <VideoCameraOutlined /> },
  ];
  const [segmentedValue, setSegmentedValue] = useState<string>();

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

  return (
    <>
      <main className="main">
        <div className="main__header">
          <div className="main__title">Thống kê - Thống kê Lợi nhuận</div>
        </div>
        {/* <div className="main__segmented">
          <CustomSegmented
            className="segmented dashboard-profit"
            options={segmentedOptions}
            setSelectedValue={setSegmentedValue}
          />
        </div> */}
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
        <div className="main__chart">
          <CustomLineChart />
        </div>
        <div className="main__table dashboard">
          <CustomTableDashboard
            className="profit"
            columnsWidth={["10%", "10%", "10%", "23%", "23%", "24%"]}
            columnsTitle={[
              "Tháng",
              "Từ ngày",
              "Đến ngày",
              "Doanh thu",
              "Chi tiêu",
              "Lợi nhuận",
            ]}
          />
        </div>
      </main>
    </>
  );
};

export default AdminDashboardProfitPage;
