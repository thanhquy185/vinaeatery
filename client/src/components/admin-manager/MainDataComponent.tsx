import type { ColumnGroupType, ColumnType } from "antd/es/table";
import TableActionsComponent from "../TableActionsComponent";

type MainDataComponentProps = {
  tableKey?: number;
  object: string;
  columns: (ColumnGroupType<any> | ColumnType<any>)[];
  data: any[];
  isLoading: boolean;
  isScroll?: boolean;
};

const MainDataComponent: React.FC<MainDataComponentProps> = ({
  tableKey,
  object,
  columns,
  data,
  isLoading,
  isScroll = false,
}) => {
  return (
    <TableActionsComponent
      key={tableKey}
      columns={columns}
      data={data || []}
      rowKey={(record) => String(record?.id)}
      loading={isLoading}
      isScroll={isScroll}
      defaultPageSize={10}
      className={"admin-manager-main__data table-actions " + object}
    />
  );
};

export default MainDataComponent;
