import React, { useState } from "react";
import { Table } from "antd";
import type {
  TablePaginationConfig,
  TableProps,
  ColumnsType,
} from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";

export type TableActionsComponentRef = {
  resetTable: () => void;
};

type TableActionsComponentProps<T> = {
  key?: number;
  columns: ColumnsType<T>;
  data: T[];
  rowSelection?: TableRowSelection<T>;
  rowKey?: string | ((record: T) => React.Key); // cho phép tự định nghĩa
  loading?: boolean;
  bordered?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  isScroll?: boolean;
  className?: string;
};

function TableActionsComponent<T>({
  key,
  columns,
  data,
  rowKey = "id", // mặc định là "id", nhưng có thể override
  loading = false,
  bordered = false,
  rowSelection,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
  isScroll = false,
  className,
}: TableActionsComponentProps<T>) {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
  });

  const handleTableChange: TableProps<T>["onChange"] = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  return (
    <Table<T>
      key={key}
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      loading={loading}
      bordered={bordered}
      rowSelection={rowSelection}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        pageSizeOptions,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
      }}
      onChange={handleTableChange}
      className={className}
      scroll={isScroll ? { x: "max-content" } : undefined}
    />
  );
}

export default TableActionsComponent;
