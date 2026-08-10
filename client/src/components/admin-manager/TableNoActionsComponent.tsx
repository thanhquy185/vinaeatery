import { Table } from "antd";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";

const handleAttribute = (item: any, attribute: string) => {
  if (attribute.includes(".")) {
    const attrs = attribute.split(".");
    return attrs.reduce((acc, key) => acc?.[key], item);
  }

  if (attribute.includes("*")) {
    const [a, b] = attribute.split("*");
    return item[a] * item[b];
  }

  return item[attribute];
};

interface TableNoActionsComponentProps {
  id?: string;
  className?: string;
  columnWidths?: string[];
  columnTitles?: string[];
  attributes?: string[];
  format?: string[];
  data?: any[];
}

const TableNoActionsComponent: React.FC<TableNoActionsComponentProps> = ({
  id,
  className,
  columnWidths = [],
  columnTitles = [],
  attributes = [],
  format = [],
  data = [],
}) => {
  const columns: ColumnsType<any> = columnTitles.map((title, index) => ({
    title,
    key: attributes[index],
    align: "center",
    width: columnWidths[index],
    className: format[index] !== "price" ? format[index] : "",
    render: (_: any, record: any) => {
      const value = handleAttribute(record, attributes[index]);

      if (format[index] === "price") {
        return vietnamMoneyFormat(value || 0);
      }

      return value;
    },
  }));

  const dataSource = data.map((item, index) => ({
    ...item,
    key: index,
  }));

  return (
    <Table
      id={id}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      className={`table-no-actions ${className ?? ""}`}
    />
  );
};

export default TableNoActionsComponent;
