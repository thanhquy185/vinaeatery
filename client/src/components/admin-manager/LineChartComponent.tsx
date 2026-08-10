import { LineChart } from "@mui/x-charts";

type LineChartComponentProps = {
  id: string;
  revenueLine?: number[];
  expenseLine?: number[];
  profitLine?: number[];
  xLabels?: string[];
};

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  id,
  revenueLine = [],
  expenseLine = [],
  profitLine = [],
  xLabels = [],
}) => {
  const height = 500;
  const margin = { left: 0, right: 32 };

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
      yAxis={[{ width: 120 }]}
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

export default LineChartComponent;
