import type { ColumnGroupType, ColumnType } from "antd/es/table";
import CustomTableActions, {
  type CustomTableActionsRef,
} from "../../common/table-actions";

// Admin - Manager Main Data Props
type AdminManagerMainDataProps = {
  tableKey?: number;
  object: string;
  columns: (ColumnGroupType<any> | ColumnType<any>)[];
  data: any[];
  isLoading: boolean;
};

// Admin - Manager Main Data
const AdminManagerMainData: React.FC<AdminManagerMainDataProps> = ({
  tableKey,
  object,
  columns,
  data,
  isLoading,
}) => {
  return (
    <CustomTableActions
      key={tableKey}
      columns={columns}
      data={data || []}
      rowKey={(record) => String(record?.id)}
      loading={isLoading}
      defaultPageSize={10}
      className={"admin-manager-main__data table-actions " + object}
    />
  );
};

export default AdminManagerMainData;
