import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { Button, InputNumber, Select, Tag } from "antd";
import { RoleSalaryTypeValue, CommonStatusValue, ModalWidthValue } from "../../../../constants/values";

import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { ManagerTableContext, ManagerTableLockModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { RoleSummaryResponseType } from "../../../../types/RoleType";

type RolesTableComponentContext = ManagerTableContext & {
  ManagerRoleModals: ManagerTableLockModals<RoleSummaryResponseType>;
};

type RolesTableComponentProps = {
  context: RolesTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<RoleSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};

const RolesTableComponent: FC<RolesTableComponentProps> = ({
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
    ManagerRoleModals,
    openModal,
  } = context;
  const columns: ColumnsType<RoleSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "12%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên chức vụ",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Cách tính lương",
      dataIndex: "salaryType",
      key: "salaryType",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Cách tính lương"
            style={{ width: "100%" }}
            options={[
              {
                label: RoleSalaryTypeValue.fixed,
                value: RoleSalaryTypeValue.fixed,
              },
              {
                label: RoleSalaryTypeValue.hours,
                value: RoleSalaryTypeValue.hours,
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
      onFilter: (value, record) => record.salaryType === value,
      sorter: (a, b) => a?.salaryType!.localeCompare(b?.salaryType!),
    },
    {
      title: "Tiền lương",
      dataIndex: "salaryValue",
      key: "salaryValue",
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
        const salaryValue = record.salaryValue ?? 0;
        if (min && salaryValue < min) return false;
        if (max && salaryValue > max) return false;
        return true;
      },
      sorter: (a, b) => a?.salaryValue! - b?.salaryValue!,
      render: (salaryValue: number) => vietnamMoneyFormat(salaryValue || 0),
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
      render: (record: RoleSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerRoleModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<RoleSummaryResponseType>
      tableKey={tableKey}
      object={object}
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
    />
  );
};

export default RolesTableComponent;
