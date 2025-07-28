import { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import type { HighlightItemData } from "@mui/x-charts";

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
const CustomPieChart = () => {
  const data = [
    { id: 0, value: 400, label: "Lương nhân viên" },
    { id: 1, value: 300, label: "Tiền nguyên liệu" },
    { id: 2, value: 300, label: "Phí khác" },
  ];

  const [highlightedItem, setHighlightedItem] =
    useState<HighlightItemData | null>(null);

  // Tính tổng để tính phần trăm
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <PieChart
      series={[
        {
          id: "pie",
          data: data,
          innerRadius: 60,
          outerRadius: 100,
          paddingAngle: 5,
          highlightScope: { highlight: "item", fade: "global" },
          arcLabel: (item) => {
            const percent = ((item.value / total) * 100).toFixed(1);
            return `${percent}%`;
          },
          arcLabelMinAngle: 10, // chỉ hiện label nếu lát đủ lớn
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
      height={200}
      width={300}
    />
  );
};

export { CustomLineChart, CustomPieChart };
