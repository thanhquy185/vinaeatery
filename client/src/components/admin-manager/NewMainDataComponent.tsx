import TableActionsComponent from "../NewTableActionsComponent";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import type { PageResponseType } from "../../types/PageResponseType";

type MainDataComponentProps<T> = {
  object: string;
  tableKey?: number;
  columns: (ColumnGroupType<T> | ColumnType<T>)[];
  data: PageResponseType<T> | undefined;
  isLoading: boolean;
  isScroll?: boolean;
  onPageChange?: (page: number, size: number) => void;
};

const MainDataComponent = <T,>({
  object,
  tableKey = 0,
  columns,
  data,
  isLoading,
  isScroll = false,
  onPageChange,
}: MainDataComponentProps<T>) => {
  return (
    <TableActionsComponent<T>
      key={tableKey}
      columns={columns}
      data={data}
      rowKey={(record: T) => String((record as unknown as any).id)}
      loading={isLoading}
      isScroll={isScroll}
      className={"admin-manager-main__data table-actions " + object}
      onPageChange={onPageChange}
    />
  );
};

export default MainDataComponent;
