import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { vietnamMoneyFormat } from "../../../utils/other-events";

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

// Custom Table No Actions Props
interface CustomTableNoActionsProps {
  id?: string;
  className?: string;
  columnWidths?: string[];
  columnTitles?: string[];
  data?: any[];
  attributes?: string[];
  format?: string[];
}

// Custom Table No Actions
const CustomTableNoActions: React.FC<CustomTableNoActionsProps> = ({
  id,
  className,
  columnWidths = [],
  columnTitles = [],
  data = [],
  attributes = [],
  format = [],
}) => {
  const columns: ColumnsType<any> = columnTitles.map((title, index) => ({
    title,
    key: attributes[index],
    align: "center",
    width: columnWidths[index],
    render: (_: any, record: any) => {
      const value = handleAttribute(record, attributes[index]);

      if (format[index] === "price") {
        return vietnamMoneyFormat(value);
      }

      return value;
    },
    className: format[index] !== "price" ? format[index] : "",
  }));

  const dataSource = data.map((item, index) => ({
    key: index,
    ...item,
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

export default CustomTableNoActions;
