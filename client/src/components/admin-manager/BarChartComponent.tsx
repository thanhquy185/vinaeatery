import { BarChart, type HighlightItemData } from "@mui/x-charts";
import { useState } from "react";

type BarChartComponentProps = {
  id: string;
  xAxisLabelValue: string;
  xAxisDataValue: string[];
  seriesLabelValue: string;
  seriesDataValue: number[];
};

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  id,
  xAxisLabelValue,
  xAxisDataValue,
  seriesLabelValue,
  seriesDataValue,
}) => {
  const heightChart = 200;
  const margin = { left: 0, bottom: 0 };
  const xAxisLabel = xAxisLabelValue || "";
  const xAxisData =
    Array.isArray(xAxisDataValue) && xAxisDataValue.length > 0
      ? xAxisDataValue
      : [""];
  const seriesLabel = seriesLabelValue || "Không có dữ liệu";
  const seriesData =
    Array.isArray(seriesDataValue) && seriesDataValue.length > 0
      ? seriesDataValue
      : [0];

  const [highlightedItem, setHighlightedItem] =
    useState<HighlightItemData | null>(null);

  return (
    <BarChart
      id={id}
      height={heightChart}
      margin={margin}
      grid={{ horizontal: true }}
      xAxis={[{ label: xAxisLabel, data: xAxisData as string[] }]}
      yAxis={[{ width: 100 }]}
      series={[
        {
          label: seriesLabel,
          data: seriesData,
          highlightScope: {
            highlight: "item", // khi hover sẽ tô sáng cột
            fade: "global", // làm mờ các cột khác
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

export default BarChartComponent;
