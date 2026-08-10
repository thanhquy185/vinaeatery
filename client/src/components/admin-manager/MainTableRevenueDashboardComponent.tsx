import { useMemo } from "react";
import { Table } from "antd";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import type { RevenueSegmentKey } from "../../constants/enums";
import type {
  RevenueBillTableBodyResponseType,
  RevenueBillTableFootResponseType,
  RevenueFoodTableBodyResponseType,
  RevenueFoodTableFootResponseType,
  RevenueTableTableBodyResponseType,
  RevenueTableTableFootResponseType,
} from "../../types/RevenueType";

const columnsWidth: Record<RevenueSegmentKey, string[]> = {
  bill: ["10%", "10%", "10%", "22%", "22%", "26%"],
  food: ["30%", "22%", "22%", "26%"],
  table: ["30%", "22%", "22%", "26%"],
};
const formats: Record<RevenueSegmentKey, string[]> = {
  bill: ["", "", "", "", "", "price"],
  food: ["", "price", "", "price"],
  table: ["", "", "", "price"],
};
const dataIndex: Record<RevenueSegmentKey, string[]> = {
  bill: ["label", "start", "end", "bill", "quantity", "revenue"],
  food: ["foodName", "price", "quantity", "revenue"],
  table: ["tableName", "bill", "quantity", "revenue"],
};

type MainTableRevenueDashboardComponentProps = {
  id: string;
  className?: string;
  segmentValue: RevenueSegmentKey;
  billTableBody?: RevenueBillTableBodyResponseType[];
  billTableFoot?: RevenueBillTableFootResponseType;
  foodTableBody?: RevenueFoodTableBodyResponseType[];
  foodTableFoot?: RevenueFoodTableFootResponseType;
  tableTableBody?: RevenueTableTableBodyResponseType[];
  tableTableFoot?: RevenueTableTableFootResponseType;
};

const MainTableRevenueDashboardComponent: React.FC<
  MainTableRevenueDashboardComponentProps
> = ({
  id,
  className,
  segmentValue,
  billTableBody,
  billTableFoot,
  foodTableBody,
  foodTableFoot,
  tableTableBody,
  tableTableFoot,
}) => {
  const columnsTitle = useMemo(() => {
    if (segmentValue === "bill" && billTableBody) {
      return {
        bill: [
          (billTableBody ?? [{ label: " " }])[0].label.split(" ")[0] ?? "",
          "Từ ngày",
          "Đến ngày",
          "Tổng số đơn",
          "Tổng số món ăn",
          "Doanh thu",
        ],
        food: [""],
        table: [""],
      };
    }
    if (segmentValue === "food" && foodTableBody) {
      return {
        bill: [""],
        food: ["Món ăn", "Giá bán", "Số lượng bán", "Doanh thu"],
        table: [""],
      };
    }
    if (segmentValue === "table" && tableTableBody) {
      return {
        bill: [""],
        food: [""],
        table: ["Bàn ăn", "Tổng số đơn", "Tổng số món ăn", "Doanh thu"],
      };
    }

    return { bill: [""], food: [""], table: [""] };
  }, [segmentValue, billTableBody, foodTableBody, tableTableBody]);
  const dataSource = useMemo(() => {
    if (segmentValue === "bill" && billTableBody) {
      return billTableBody.map((item, index) => ({
        key: index,
        ...item,
      }));
    } else if (segmentValue === "food" && foodTableBody) {
      return foodTableBody.map((item, index) => ({
        key: index,
        ...item,
      }));
    } else if (segmentValue === "table" && tableTableBody) {
      return tableTableBody.map((item, index) => ({
        key: index,
        ...item,
      }));
    }

    return [];
  }, [segmentValue, billTableBody, foodTableBody, tableTableBody]);
  const columns = useMemo(() => {
    return columnsTitle[segmentValue].map((title, index) => ({
      title,
      dataIndex: dataIndex[segmentValue][index],
      key: dataIndex[segmentValue][index],
      width: columnsWidth[segmentValue][index],
      className: formats[segmentValue][index] === "info" ? "left" : "center",
      render:
        segmentValue === "food" && index === 0
          ? (_: any, record: RevenueFoodTableBodyResponseType) => ({
              children: <span className="cell-span">{record.name}</span>,
              props: {
                rowSpan: record.rowSpan,
              },
            })
          : (value: any) => {
              if (formats[segmentValue][index] === "price") {
                return vietnamMoneyFormat(Number(value));
              }

              return value;
            },
    }));
  }, [segmentValue, billTableBody, foodTableBody, tableTableBody]);

  const summary = () => {
    if (segmentValue === "bill" && billTableFoot) {
      return (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}>
              <b>TỔNG</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              {billTableFoot.totalBill}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="center">
              {billTableFoot.totalQuantity}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5} align="center">
              {vietnamMoneyFormat(billTableFoot.totalRevenue)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    } else if (segmentValue === "food" && foodTableFoot) {
      return (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <b>TỔNG</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center">
              {foodTableFoot.totalQuantity}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              {vietnamMoneyFormat(foodTableFoot.totalRevenue)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    } else if (segmentValue === "table" && tableTableFoot) {
      return (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={1}>
              <b>TỔNG</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="center">
              {tableTableFoot.totalBill}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center">
              {tableTableFoot.totalQuantity}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              {vietnamMoneyFormat(tableTableFoot.totalRevenue)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    }
  };

  return (
    <div id={id} className="admin-manager-main__data">
      <Table
        columns={columns}
        dataSource={dataSource as any}
        pagination={false}
        summary={summary}
        className={"table-dashboard " + className}
      />
    </div>
  );
};

export default MainTableRevenueDashboardComponent;
