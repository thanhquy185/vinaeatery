import { useMemo } from "react";
import { Table } from "antd";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type {
  ProfitTableBodyResponseType,
  ProfitTableFootResponseType,
} from "../../types/ProfitType";

const columnsWidth = ["10%", "10%", "10%", "23%", "23%", "24%"];
const formats = ["", "", "", "price", "price", "price"];
const dataIndex = ["label", "start", "end", "revenue", "expense", "profit"];

interface MainTableProfitDashboardComponentProps {
  id: string;
  className?: string;
  tableBody?: ProfitTableBodyResponseType[];
  tableFoot?: ProfitTableFootResponseType;
}

const MainTableProfitDashboardComponent: React.FC<
  MainTableProfitDashboardComponentProps
> = ({
  id,
  className,
  tableBody = [],
  tableFoot = {
    totalRevenue: 0,
    totalExpense: 0,
    totalProfit: 0,
  },
}) => {
  const columnsTitle = useMemo(
    () => [
      tableBody[0]?.label.split(" ")[0] ?? "",
      "Từ ngày",
      "Đến ngày",
      "Doanh thu",
      "Chi tiêu",
      "Lợi nhuận",
    ],
    [tableBody],
  );
  const dataSource = useMemo(() => {
    return tableBody.map((item, index) => ({
      key: index,
      ...item,
    }));
  }, [tableBody]);
  const columns: ColumnsType<ProfitTableBodyResponseType> = useMemo(() => {
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
      // render: (value, record, index) => ({
      //   children: value,
      //   props: {
      //     rowSpan: index === 0 ? 5 : 0,
      //   },
      // }),
    }));
  }, [tableBody]);

  const summary = () => {
    if (!tableFoot) return null;

    return (
      <Table.Summary>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={3}>
            <b>TỔNG</b>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} align="center">
            {vietnamMoneyFormat(tableFoot.totalRevenue)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4} align="center">
            {vietnamMoneyFormat(tableFoot.totalExpense)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={5} align="center">
            {vietnamMoneyFormat(tableFoot.totalProfit)}
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

export default MainTableProfitDashboardComponent;
