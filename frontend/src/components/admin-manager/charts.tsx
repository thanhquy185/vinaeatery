import { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart, type HighlightItemData } from "@mui/x-charts";
import type { PieChartProps } from "../../common/props";

// Các giá trị chung
const heightChart = 200;

// Biểu đồ đường
const CustomLineChart = (
  {
    id, revenueLineValue, expenseLineValue, profitLineValue, xLabelsValue
  }: {
    id?: string, revenueLineValue?: number[], expenseLineValue?: number[],
    profitLineValue?: number[], xLabelsValue?: string[]
  }) => {
  const height = 500;
  const margin = { right: 24 };
  const revenueLine = revenueLineValue || [];
  const expenseLine = expenseLineValue || [];
  const profitLine = profitLineValue || [];
  const xLabels = xLabelsValue || [];

  return (
    <LineChart
      id={id!}
      height={height}
      series={[
        {
          data: revenueLine,
          label: "Doanh thu",
          area: true,
          showMark: true,
          color: "#4e79a7",
        },
        {
          data: expenseLine,
          label: "Chi tiêu",
          area: true,
          showMark: true,
          color: "#e15759",
        },
        {
          data: profitLine,
          label: "Lợi nhuận",
          area: true,
          showMark: true,
          color: "#76b7b2",
        },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      yAxis={[{ width: 50 }]}
      margin={margin}
      grid={{ vertical: true, horizontal: true }}
      sx={{
        "& .MuiAreaElement-root:nth-of-type(1)": {
          opacity: 0.2,
        },
        "& .MuiAreaElement-root:nth-of-type(2)": {
          opacity: 0.2,
        },
        "& .MuiAreaElement-root:nth-of-type(3)": {
          opacity: 0.2,
        },
        "& .MuiLineElement-root": {
          strokeWidth: 2,
        },
      }}
    />
  );
};

// Biểu đồ tròn
const CustomPieChart = ({
  id,
  dataValue,
  maxItemsToShow = 5,
}: {
  id: string;
  dataValue: PieChartProps[];
  maxItemsToShow?: number;
}) => {
  const [highlightedItem, setHighlightedItem] =
    useState<HighlightItemData | null>(null);

  // Sắp xếp giảm dần theo value
  const sortedData = Array.isArray(dataValue) && dataValue.length > 0
    ? [...dataValue].sort((a, b) => b.value - a.value)
    : [{ id: 0, value: 1, label: "Không có dữ liệu" }];

  // Chia thành các mục chính và phần còn lại
  const mainItems = sortedData.slice(0, maxItemsToShow);
  const otherItems = sortedData.slice(maxItemsToShow);

  // Tổng giá trị của các mục "khác"
  const otherTotal = otherItems.reduce((sum, item) => sum + item.value, 0);

  // Gộp thành mảng mới để vẽ
  const chartData = [...mainItems];
  if (otherTotal > 0) {
    chartData.push({
      id: 9999,
      value: otherTotal,
      label: "Khác",
    });
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <PieChart
      id={id}
      series={[
        {
          id: "pie",
          data: chartData,
          innerRadius: 60,
          outerRadius: 100,
          paddingAngle: 5,
          highlightScope: { highlight: "item", fade: "global" },
          arcLabel: (item) => {
            const percent = ((item.value / total) * 100).toFixed(1);
            return `${percent}%`;
          },
          arcLabelMinAngle: 10,
        },
      ]}
      sx={{
        "& text": {
          fill: "white",
          fontSize: 14,
          fontWeight: 600,
        },
      }}
      highlightedItem={highlightedItem}
      onHighlightChange={setHighlightedItem}
      height={heightChart}
      width={300}
    />
  );
};

// Biểu đồ cột
const CustomBarChart = ({
  id,
  xAxisLabelValue,
  xAxisDataValue,
  seriesLabelValue,
  seriesDataValue,
}: {
  id?: string;
  xAxisLabelValue?: string;
  xAxisDataValue?: string[];
  seriesLabelValue?: string;
  seriesDataValue?: number[];
}) => {
  const margin = { left: 0, bottom: 0 };
  const xAxisLabel = xAxisLabelValue || "";
  const xAxisData = Array.isArray(xAxisDataValue) && xAxisDataValue.length > 0 ? xAxisDataValue : [""];
  const seriesLabel = seriesLabelValue || "Không có dữ liệu";
  const seriesData = Array.isArray(seriesDataValue) && seriesDataValue.length > 0 ? seriesDataValue : [0];


  const [highlightedItem, setHighlightedItem] =
    useState<HighlightItemData | null>(null);

  return (
    <BarChart
      id={id}
      height={heightChart}
      margin={margin}
      grid={{ horizontal: true }}
      xAxis={[{ label: xAxisLabel, data: xAxisData as string[] }]}
      series={[
        {
          label: seriesLabel,
          data: seriesData,
          highlightScope: {
            highlight: "item", // khi hover sẽ tô sáng cột
            fade: "global",     // làm mờ các cột khác
          },
        },
      ]}
      highlightedItem={highlightedItem}
      onHighlightChange={setHighlightedItem}
      sx={{
        "& text": {
          fill: "white",
          fontSize: 14,
          fontWeight: 600,
        },
      }}
    />
  );
};

export { CustomLineChart, CustomPieChart, CustomBarChart };
