import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { Tag } from "antd";
import { CommonStatusValue, ModalWidthValue } from "../../../../constants/values";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { ManagerTableContext, ManagerTableLockModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { CategoryIngredientSummaryResponseType } from "../../../../types/CategoryIngredientType";

type CategoryIngredientsTableComponentContext = ManagerTableContext & {
  ManagerCategoryIngredientModals: ManagerTableLockModals<CategoryIngredientSummaryResponseType>;
};

type CategoryIngredientsTableComponentProps = {
  context: CategoryIngredientsTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<CategoryIngredientSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};

const CategoryIngredientsTableComponent: FC<CategoryIngredientsTableComponentProps> = ({
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
    ManagerCategoryIngredientModals,
    openModal,
  } = context;
  const columns: ColumnsType<CategoryIngredientSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "20%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên loại nguyên liệu",
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
      render: (record: CategoryIngredientSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerCategoryIngredientModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<CategoryIngredientSummaryResponseType>
      tableKey={tableKey}
      object={object}
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
    />
  );
};

export default CategoryIngredientsTableComponent;
