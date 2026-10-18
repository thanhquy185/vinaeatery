import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { Button, InputNumber, Select, Tag } from "antd";
import {
  CategoryTableSurchargeTypeValue,
  CommonStatusValue,
  ModalWidthValue,
} from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { ManagerTableContext, ManagerTableLockModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { CategoryTableSummaryResponseType } from "../../../../types/CategoryTableType";

type CategoryTablesTableComponentContext = ManagerTableContext & {
  ManagerCategoryTableModals: ManagerTableLockModals<CategoryTableSummaryResponseType>;
};

type CategoryTablesTableComponentProps = {
  context: CategoryTablesTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<CategoryTableSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};

const CategoryTablesTableComponent: FC<CategoryTablesTableComponentProps> = ({
  context,
  tableKey,
  object,
  data,
  isLoading,
  onPageChange,
}) => {
  const {
    nameEN,
    nameVN,
    isManager,
    restaurantIdForCrud,
    validActions,
    ManagerCategoryTableModals,
    openModal,
  } = context;
  const columns: ColumnsType<CategoryTableSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "12%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên loại bàn ăn",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại phụ thu",
      dataIndex: "surchargeType",
      key: "surchargeType",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại phụ thu"
            style={{ width: "100%" }}
            options={[
              {
                label: CategoryTableSurchargeTypeValue.fixed,
                value: CategoryTableSurchargeTypeValue.fixed,
              },
              {
                label: CategoryTableSurchargeTypeValue.percent,
                value: CategoryTableSurchargeTypeValue.percent,
              },
            ]}
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
      onFilter: (value, record) => record.surchargeType === value,
      sorter: (a, b) => a.surchargeType.localeCompare(b.surchargeType),
    },
    {
      title: "Giá trị phụ thu",
      dataIndex: "surchargeValue",
      key: "surchargeValue",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const surchargeValue = record.surchargeValue ?? 0;
        if (min && surchargeValue < min) return false;
        if (max && surchargeValue > max) return false;
        return true;
      },
      sorter: (a, b) => a.surchargeValue - b.surchargeValue,
      render: (surchargeValue: number) => vietnamMoneyFormat(surchargeValue),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
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
      key: "actions",
      width: "12%",
      className: "buttons",
      render: (record: CategoryTableSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerCategoryTableModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<CategoryTableSummaryResponseType>
      tableKey={tableKey}
      object={object}
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
    />
  );
};

export default CategoryTablesTableComponent;
