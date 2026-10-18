import StatisticCardComponent from "./StatisticCardComponent";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

type MainStatisticCardsComponentProps = {
  titles: string[];
  values: number[];
};

const MainStatisticCardsComponent: React.FC<
  MainStatisticCardsComponentProps
> = ({ titles, values }) => {
  return (
    <div className="admin-manager-main__cards">
      <StatisticCardComponent
        title={titles[0]}
        value={values[0]}
        prefix={<DollarOutlined />}
        separator="."
        valueStyle={{ color: "#d2a016" }}
      />
      <StatisticCardComponent
        title={titles[1]}
        value={values[1]}
        prefix={<FileTextOutlined />}
        valueStyle={{ color: "#274cf4" }}
      />
      <StatisticCardComponent
        title={titles[2]}
        value={values[2]}
        prefix={<CheckCircleOutlined />}
        valueStyle={{ color: "#3f8600" }}
      />
      <StatisticCardComponent
        title={titles[3]}
        value={values[3]}
        prefix={<CloseCircleOutlined />}
        valueStyle={{ color: "#cf1322" }}
      />
      <StatisticCardComponent
        title={titles[4]}
        value={values[4]}
        prefix={<ClockCircleOutlined />}
        valueStyle={{ color: "#676767" }}
      />
    </div>
  );
};

export default MainStatisticCardsComponent;
