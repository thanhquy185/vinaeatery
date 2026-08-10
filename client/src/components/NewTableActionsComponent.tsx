import React from "react";
import { Table } from "antd";
import type { TableProps, ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import type { PageResponseType } from "../types/PageResponseType";

type TableActionsComponentProps<T> = {
  key: number;
  columns: ColumnsType<T>;
  data: PageResponseType<T> | undefined;
  rowSelection?: TableRowSelection<T>;
  rowKey?: string | ((record: T) => React.Key); // cho phép tự định nghĩa
  loading?: boolean;
  bordered?: boolean;
  pageSizeOptions?: number[];
  isScroll?: boolean;
  className?: string;
  onPageChange?: (page: number, size: number) => void;
};

const TableActionsComponent = <T,>({
  key,
  columns,
  data,
  rowKey = "id", // mặc định là "id", nhưng có thể override
  loading = false,
  bordered = false,
  rowSelection,
  pageSizeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  isScroll = false,
  className,
  onPageChange,
}: TableActionsComponentProps<T>) => {
  const handleTableChange: TableProps<T>["onChange"] = (pagination) => {
    onPageChange?.(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  return (
    <Table<T>
      key={key}
      columns={columns}
      dataSource={data?.content || []}
      rowKey={rowKey}
      loading={loading}
      bordered={bordered}
      rowSelection={rowSelection}
      pagination={{
        current: (data?.number ?? 0) + 1,
        pageSize: data?.size ?? 10,
        total: data?.totalElements ?? 0,

        showSizeChanger: true,
        pageSizeOptions,

        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
      }}
      className={className}
      scroll={isScroll ? { x: "max-content" } : undefined}
      onChange={handleTableChange}
    />
  );
};

export default TableActionsComponent;
