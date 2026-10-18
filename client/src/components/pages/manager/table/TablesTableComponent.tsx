import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { Button, Select, Tag } from "antd";
import { CommonStatusValue, ModalWidthValue } from "../../../../constants/values";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { FloorCrudResponseType } from "../../../../types/FloorType";
import type { CategoryTableCrudResponseType } from "../../../../types/CategoryTableType";
import type { ManagerTableContext, ManagerTableLockModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { TableSummaryResponseType } from "../../../../types/TableType";

type TablesTableComponentContext = ManagerTableContext & {
  ManagerTableModals: ManagerTableLockModals<TableSummaryResponseType>;
  categoryTables: CategoryTableCrudResponseType[] | undefined;
  floors: FloorCrudResponseType[] | undefined;
};

type TablesTableComponentProps = {
  context: TablesTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<TableSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};

const TablesTableComponent: FC<TablesTableComponentProps> = ({
  context,
  tableKey,
  object,
  data,
  isLoading,
  onPageChange,
}) => {
  const {
    categoryTables,
    floors,
    nameEN,
    nameVN,
    isManager,
    restaurantIdForCrud,
    validActions,
    ManagerTableModals,
    openModal,
  } = context;
  const columns: ColumnsType<TableSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên loại bàn ăn",
      dataIndex: "name",
      key: "name",
      width: "24%",
      className: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Số chỗ ngồi",
      dataIndex: "seats",
      key: "seats",
      width: "12%",
      sorter: (a, b) => a.seats - b.seats,
    },
    {
      title: "Loại bàn ăn",
      key: "categoryTable",
      width: "17%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại bàn ăn"
            style={{ width: "100%" }}
            options={categoryTables?.map((categoryTable) => ({
              label: `#${categoryTable.id} - ${categoryTable.name}`,
              value: categoryTable.id,
            }))}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.categoryTable.id === value,
      sorter: (a, b) => a.categoryTable.id - b.categoryTable.id,
      render: (record) =>
        `#${record.categoryTable.id} - ${record.categoryTable.name}`,
    },
    {
      title: "Tầng",
      key: "floor",
      width: "17%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Tầng"
            style={{ width: "100%" }}
            options={floors?.map((floor) => ({
              label: `#${floor.id} - ${floor.name}`,
              value: floor.id,
            }))}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.floor.id === value,
      sorter: (a, b) => a.floor.id - b.floor.id,
      render: (record) => `#${record.floor.id} - ${record.floor.name}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag
          color={status === CommonStatusValue.active ? "green" : "red"}
          bordered={false}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      width: "10%",
      className: "buttons",
      render: (record: TableSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerTableModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<TableSummaryResponseType>
      tableKey={tableKey}
      object={object}
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
    />
  );
};

export default TablesTableComponent;
