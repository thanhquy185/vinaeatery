import TableNoActionsComponent from "./TableNoActionsComponent";
import type { RoleHistoryDetailResponseType } from "../../types/RoleHistoryType";

type TableRoleHistoriesComponentProps = {
  roleHistories: RoleHistoryDetailResponseType[];
};

const TableRoleHistoriesComponent: React.FC<
  TableRoleHistoriesComponentProps
> = ({ roleHistories }) => {
  return (
    <TableNoActionsComponent
      className="role-history"
      columnWidths={["10", "24%", "18", "18", "15%", "15%"]}
      columnTitles={[
        "Mã chức vụ",
        "Tên chức vụ",
        "Cách tính lương",
        "Tiền lương",
        "Thời gian bắt đầu",
        "Thời gian kết thúc",
      ]}
      attributes={[
        "role.id",
        "role.name",
        "role.salaryType",
        "role.salaryValue",
        "dateStart",
        "dateEnd",
      ]}
      format={["", "left", "", "price", "", ""]}
      data={roleHistories}
    />
  );
};

export default TableRoleHistoriesComponent;
