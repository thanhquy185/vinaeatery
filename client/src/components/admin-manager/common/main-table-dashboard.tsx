import React, { useMemo } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { vietnamMoneyFormat } from "../../../utils/other-events";

interface AdminManagerMainTableDashboardProps {
  id?: string;
  className?: string;
  columnsWidth?: string[];
  columnsTitle?: string[];
  tbody?: (string | number)[][];
  format?: string[];
  tfoot?: (string | number)[];
}

const AdminManagerMainTableDashboard: React.FC<
  AdminManagerMainTableDashboardProps
> = ({
  id,
  className,
  columnsWidth = [],
  columnsTitle = [],
  tbody = [],
  format = [],
  tfoot = [],
}) => {
  const dataSource = useMemo(() => {
    return tbody.map((row, rowIndex) => {
      const obj: any = { key: rowIndex };

      row.forEach((cell, colIndex) => {
        obj[`col${colIndex}`] = cell;
      });

      return obj;
    });
  }, [tbody]);
  const columns: ColumnsType<any> = useMemo(() => {
    return columnsTitle.map((title, index) => ({
      title,
      dataIndex: `col${index}`,
      key: `col${index}`,
      width: columnsWidth[index],
      // align: format[index] === "info" ? "left" : "center",
      // align: "center",
      className: format[index] === "info" ? "left" : "center",
      render: (value: any) => {
        if (format[index] === "price") {
          return vietnamMoneyFormat(Number(value));
        }
        return value;
      },
    }));
  }, [columnsTitle, columnsWidth, format]);
  const summary = () => {
    if (!tfoot || tfoot.length === 0) return null;

    const colSpan =
      columnsTitle.length === columnsWidth.length
        ? columnsTitle.length - tfoot.length
        : 1;

    return (
      <Table.Summary>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={colSpan}>
            <b>Tổng:</b>
          </Table.Summary.Cell>

          {tfoot.map((value, index) => {
            const formatIndex = columnsTitle.length - tfoot.length + index;

            return (
              <Table.Summary.Cell key={index} index={index + 1} align="center">
                {format[formatIndex] === "price"
                  ? vietnamMoneyFormat(Number(value))
                  : value}
              </Table.Summary.Cell>
            );
          })}
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

export default AdminManagerMainTableDashboard;
