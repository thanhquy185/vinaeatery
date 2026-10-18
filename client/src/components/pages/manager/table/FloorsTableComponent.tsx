import { Tag } from "antd";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { CommonStatusValue, ModalWidthValue } from "../../../../constants/values";
import type { ColumnsType } from "antd/es/table";
import type { JSX } from "react";
import type { ModalState } from "../../../../hooks/useModal";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { FloorSummaryResponseType } from "../../../../types/FloorType";

type FloorModalHandlers = {
  detail: (data: FloorSummaryResponseType) => JSX.Element;
  update: (data: FloorSummaryResponseType) => JSX.Element;
  lock: (id: number, status: string) => JSX.Element;
};

interface FloorsTableComponentProps {
  tableKey: number;
  nameEN: string;
  nameVN: string;
  isManager: boolean;
  validActions: string | undefined;
  restaurantIdForCrud: number;
  managerModals: FloorModalHandlers;
  openModal: (payload: Omit<ModalState, "open">) => void;
  data: PageResponseType<FloorSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
}

const FloorsTableComponent: React.FC<FloorsTableComponentProps> = ({
  tableKey,
  nameEN,
  nameVN,
  isManager,
  validActions,
  restaurantIdForCrud,
  managerModals,
  openModal,
  data,
  isLoading,
  onPageChange,
}) => {
  const columns: ColumnsType<FloorSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "20%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên tầng",
      dataIndex: "name",
      key: "name",
      width: "40%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "20%",
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
      width: "20%",
      className: "buttons",
      render: (record: FloorSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={managerModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<FloorSummaryResponseType>
      tableKey={tableKey}
      object={nameEN}
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
    />
  );
};

export default FloorsTableComponent;
