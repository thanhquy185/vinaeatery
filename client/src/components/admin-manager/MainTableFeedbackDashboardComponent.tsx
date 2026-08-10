import { useMemo } from "react";
import { Table } from "antd";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type {
  DFeedbackTableBodyResponseType,
  DFeedbackTableFootResponseType,
} from "../../types/DFeedbackType";

const columnsTitle = ["Tiêu chí", "1 sao", "2 sao", "3 sao", "4 sao", "5 sao"];
const columnsWidth = ["30%", "14%", "14%", "14%", "14%", "14%"];
const formats = ["", "", "", "", "", ""];
const dataIndex = ["name", "score1", "score2", "score3", "score4", "score5"];

interface MainTableFeedbackDashboardComponentProps {
  id: string;
  className?: string;
  tableBody?: DFeedbackTableBodyResponseType[];
  tableFoot?: DFeedbackTableFootResponseType;
}

const MainTableFeedbackDashboardComponent: React.FC<
  MainTableFeedbackDashboardComponentProps
> = ({
  id,
  className,
  tableBody = [],
  tableFoot = {
    totalScore1: 0,
    totalScore2: 0,
    totalScore3: 0,
    totalScore4: 0,
    totalScore5: 0,
  },
}) => {
  const dataSource = useMemo(() => {
    return tableBody.map((item, index) => ({
      key: index,
      ...item,
    }));
  }, [tableBody]);
  const columns: ColumnsType<DFeedbackTableBodyResponseType> = useMemo(() => {
    return columnsTitle.map((title, index) => ({
      title,
      dataIndex: dataIndex[index],
      key: dataIndex[index],
      width: columnsWidth[index],
      className: formats[index] === "info" ? "left" : "center",
      render: (value: any) => {
        if (formats[index] === "price") {
          return vietnamMoneyFormat(Number(value));
        }

        return value;
      },
    }));
  }, [tableBody]);

  const summary = () => {
    if (!tableFoot) return null;

    return (
      <Table.Summary>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={1}>
            <b>TỔNG</b>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">
            {tableFoot.totalScore1}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="center">
            {tableFoot.totalScore2}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} align="center">
            {tableFoot.totalScore3}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4} align="center">
            {tableFoot.totalScore4}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={5} align="center">
            {tableFoot.totalScore5}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <div id={id} className="admin-manager-main__data">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        summary={summary}
        className={"table-dashboard " + className}
      />
    </div>
  );
};

export default MainTableFeedbackDashboardComponent;
