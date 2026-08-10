import { useState } from "react";
import { PieChart } from "@mui/x-charts";
import type { HighlightItemData } from "@mui/x-charts";
import type { PieChartProps } from "../../constants/props";

type PieChartComponentProps = {
  id: string;
  data: PieChartProps[];
  maxItemsToShow?: number;
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  id,
  data,
  maxItemsToShow = 5,
}) => {
  const heightChart = 200;

  const [highlightedItem, setHighlightedItem] =
    useState<HighlightItemData | null>(null);

  // Sắp xếp giảm dần theo value
  const sortedData =
    Array.isArray(data) && data.length > 0
      ? [...data].sort((a, b) => b.value - a.value)
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
          paddingAngle: 2,
          cornerRadius: 6,
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
          fontSize: 10,
          fontWeight: 500,
        },
      }}
      highlightedItem={highlightedItem}
      onHighlightChange={setHighlightedItem}
      height={heightChart}
      width={300}
    />
  );
};

export default PieChartComponent;
