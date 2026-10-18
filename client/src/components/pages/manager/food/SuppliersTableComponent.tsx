import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { Tag } from "antd";
import { CommonStatusValue, ModalWidthValue } from "../../../../constants/values";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { ManagerTableContext, ManagerTableLockModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { SupplierSummaryResponseType } from "../../../../types/SupplierType";

type SuppliersTableComponentContext = ManagerTableContext & {
  ManagerSupplierModals: ManagerTableLockModals<SupplierSummaryResponseType>;
};

type SuppliersTableComponentProps = {
  context: SuppliersTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<SupplierSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};

const SuppliersTableComponent: FC<SuppliersTableComponentProps> = ({
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
    ManagerSupplierModals,
    openModal,
  } = context;
  const columns: ColumnsType<SupplierSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "12%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "fullname",
      key: "fullname",
      width: "34%",
      className: "left",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      width: "10%",
      className: "buttons",
      render: (record: SupplierSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerSupplierModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<SupplierSummaryResponseType>
      tableKey={tableKey}
      object={object}
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
    />
  );
};

export default SuppliersTableComponent;
