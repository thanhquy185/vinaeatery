import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { Image, Tag } from "antd";
import { CommonStatusValue, ImageSourcePath, ModalWidthValue } from "../../../../constants/values";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { ManagerTableContext, ManagerTableLockModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { CategoryFoodSummaryResponseType } from "../../../../types/CategoryFoodType";

type CategoryFoodsTableComponentContext = ManagerTableContext & {
  ManagerCategoryFoodModals: ManagerTableLockModals<CategoryFoodSummaryResponseType>;
};

type CategoryFoodsTableComponentProps = {
  context: CategoryFoodsTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<CategoryFoodSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};

const CategoryFoodsTableComponent: FC<CategoryFoodsTableComponentProps> = ({
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
    ManagerCategoryFoodModals,
    openModal,
  } = context;
  const columns: ColumnsType<CategoryFoodSummaryResponseType> = [
    {
      title: "",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "20%",
      render: (imageUrl: string) => (
        <Image src={imageUrl ?? ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "14%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên loại món ăn",
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
      width: "16%",
      className: "buttons",
      render: (record: CategoryFoodSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerCategoryFoodModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<CategoryFoodSummaryResponseType>
      tableKey={tableKey}
      object={object}
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
    />
  );
};

export default CategoryFoodsTableComponent;
